const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCommunityByQuery module", () => {
  let sandbox;
  let getCommunityByQuery;
  let CommunityStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test Community",
    getData: () => ({ id: fakeId, name: "Test Community" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getCommunityByQuery = proxyquire(
      "../../../../../src/db-layer/main/Community/utils/getCommunityByQuery",
      {
        models: { Community: CommunityStub },
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

  describe("getCommunityByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getCommunityByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test Community" });
      sinon.assert.calledOnce(CommunityStub.findOne);
      sinon.assert.calledWith(CommunityStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      CommunityStub.findOne.resolves(null);

      const result = await getCommunityByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(CommunityStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCommunityByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCommunityByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      CommunityStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getCommunityByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      CommunityStub.findOne.resolves({ getData: () => undefined });

      const result = await getCommunityByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
