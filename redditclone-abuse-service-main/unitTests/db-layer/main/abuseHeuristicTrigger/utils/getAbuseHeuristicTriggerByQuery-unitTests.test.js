const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getAbuseHeuristicTriggerByQuery module", () => {
  let sandbox;
  let getAbuseHeuristicTriggerByQuery;
  let AbuseHeuristicTriggerStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test AbuseHeuristicTrigger",
    getData: () => ({ id: fakeId, name: "Test AbuseHeuristicTrigger" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseHeuristicTriggerStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getAbuseHeuristicTriggerByQuery = proxyquire(
      "../../../../../src/db-layer/main/AbuseHeuristicTrigger/utils/getAbuseHeuristicTriggerByQuery",
      {
        models: { AbuseHeuristicTrigger: AbuseHeuristicTriggerStub },
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

  describe("getAbuseHeuristicTriggerByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getAbuseHeuristicTriggerByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test AbuseHeuristicTrigger",
      });
      sinon.assert.calledOnce(AbuseHeuristicTriggerStub.findOne);
      sinon.assert.calledWith(AbuseHeuristicTriggerStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      AbuseHeuristicTriggerStub.findOne.resolves(null);

      const result = await getAbuseHeuristicTriggerByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(AbuseHeuristicTriggerStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getAbuseHeuristicTriggerByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getAbuseHeuristicTriggerByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      AbuseHeuristicTriggerStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getAbuseHeuristicTriggerByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseHeuristicTriggerByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      AbuseHeuristicTriggerStub.findOne.resolves({ getData: () => undefined });

      const result = await getAbuseHeuristicTriggerByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
