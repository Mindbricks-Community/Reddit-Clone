const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getAbuseInvestigationByQuery module", () => {
  let sandbox;
  let getAbuseInvestigationByQuery;
  let AbuseInvestigationStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test AbuseInvestigation",
    getData: () => ({ id: fakeId, name: "Test AbuseInvestigation" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseInvestigationStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getAbuseInvestigationByQuery = proxyquire(
      "../../../../../src/db-layer/main/AbuseInvestigation/utils/getAbuseInvestigationByQuery",
      {
        models: { AbuseInvestigation: AbuseInvestigationStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(msg, details) {
              super(msg);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
          BadRequestError: class BadRequestError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "BadRequestError";
            }
          },
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getAbuseInvestigationByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getAbuseInvestigationByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test AbuseInvestigation",
      });
      sinon.assert.calledOnce(AbuseInvestigationStub.findOne);
      sinon.assert.calledWith(AbuseInvestigationStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      AbuseInvestigationStub.findOne.resolves(null);

      const result = await getAbuseInvestigationByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(AbuseInvestigationStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getAbuseInvestigationByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getAbuseInvestigationByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      AbuseInvestigationStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getAbuseInvestigationByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseInvestigationByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      AbuseInvestigationStub.findOne.resolves({ getData: () => undefined });

      const result = await getAbuseInvestigationByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
