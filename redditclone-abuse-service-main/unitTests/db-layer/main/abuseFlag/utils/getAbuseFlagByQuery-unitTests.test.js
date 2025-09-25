const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getAbuseFlagByQuery module", () => {
  let sandbox;
  let getAbuseFlagByQuery;
  let AbuseFlagStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test AbuseFlag",
    getData: () => ({ id: fakeId, name: "Test AbuseFlag" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseFlagStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getAbuseFlagByQuery = proxyquire(
      "../../../../../src/db-layer/main/AbuseFlag/utils/getAbuseFlagByQuery",
      {
        models: { AbuseFlag: AbuseFlagStub },
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

  describe("getAbuseFlagByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getAbuseFlagByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test AbuseFlag" });
      sinon.assert.calledOnce(AbuseFlagStub.findOne);
      sinon.assert.calledWith(AbuseFlagStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      AbuseFlagStub.findOne.resolves(null);

      const result = await getAbuseFlagByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(AbuseFlagStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getAbuseFlagByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getAbuseFlagByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      AbuseFlagStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getAbuseFlagByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseFlagByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      AbuseFlagStub.findOne.resolves({ getData: () => undefined });

      const result = await getAbuseFlagByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
