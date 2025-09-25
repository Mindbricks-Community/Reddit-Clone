const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getGlobalUserRestrictionByQuery module", () => {
  let sandbox;
  let getGlobalUserRestrictionByQuery;
  let GlobalUserRestrictionStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test GlobalUserRestriction",
    getData: () => ({ id: fakeId, name: "Test GlobalUserRestriction" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GlobalUserRestrictionStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getGlobalUserRestrictionByQuery = proxyquire(
      "../../../../../src/db-layer/main/GlobalUserRestriction/utils/getGlobalUserRestrictionByQuery",
      {
        models: { GlobalUserRestriction: GlobalUserRestrictionStub },
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

  describe("getGlobalUserRestrictionByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getGlobalUserRestrictionByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test GlobalUserRestriction",
      });
      sinon.assert.calledOnce(GlobalUserRestrictionStub.findOne);
      sinon.assert.calledWith(GlobalUserRestrictionStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      GlobalUserRestrictionStub.findOne.resolves(null);

      const result = await getGlobalUserRestrictionByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(GlobalUserRestrictionStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getGlobalUserRestrictionByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getGlobalUserRestrictionByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      GlobalUserRestrictionStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getGlobalUserRestrictionByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGlobalUserRestrictionByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      GlobalUserRestrictionStub.findOne.resolves({ getData: () => undefined });

      const result = await getGlobalUserRestrictionByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
