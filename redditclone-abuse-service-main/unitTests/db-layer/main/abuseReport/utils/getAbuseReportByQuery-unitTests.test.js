const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getAbuseReportByQuery module", () => {
  let sandbox;
  let getAbuseReportByQuery;
  let AbuseReportStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test AbuseReport",
    getData: () => ({ id: fakeId, name: "Test AbuseReport" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseReportStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getAbuseReportByQuery = proxyquire(
      "../../../../../src/db-layer/main/AbuseReport/utils/getAbuseReportByQuery",
      {
        models: { AbuseReport: AbuseReportStub },
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

  describe("getAbuseReportByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getAbuseReportByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test AbuseReport" });
      sinon.assert.calledOnce(AbuseReportStub.findOne);
      sinon.assert.calledWith(AbuseReportStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      AbuseReportStub.findOne.resolves(null);

      const result = await getAbuseReportByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(AbuseReportStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getAbuseReportByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getAbuseReportByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      AbuseReportStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getAbuseReportByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseReportByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      AbuseReportStub.findOne.resolves({ getData: () => undefined });

      const result = await getAbuseReportByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
