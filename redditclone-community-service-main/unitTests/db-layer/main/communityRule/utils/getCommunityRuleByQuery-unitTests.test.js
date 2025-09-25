const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCommunityRuleByQuery module", () => {
  let sandbox;
  let getCommunityRuleByQuery;
  let CommunityRuleStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test CommunityRule",
    getData: () => ({ id: fakeId, name: "Test CommunityRule" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityRuleStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getCommunityRuleByQuery = proxyquire(
      "../../../../../src/db-layer/main/CommunityRule/utils/getCommunityRuleByQuery",
      {
        models: { CommunityRule: CommunityRuleStub },
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

  describe("getCommunityRuleByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getCommunityRuleByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test CommunityRule" });
      sinon.assert.calledOnce(CommunityRuleStub.findOne);
      sinon.assert.calledWith(CommunityRuleStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      CommunityRuleStub.findOne.resolves(null);

      const result = await getCommunityRuleByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(CommunityRuleStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCommunityRuleByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCommunityRuleByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      CommunityRuleStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getCommunityRuleByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityRuleByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      CommunityRuleStub.findOne.resolves({ getData: () => undefined });

      const result = await getCommunityRuleByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
