const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCommunityPinnedByQuery module", () => {
  let sandbox;
  let getCommunityPinnedByQuery;
  let CommunityPinnedStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test CommunityPinned",
    getData: () => ({ id: fakeId, name: "Test CommunityPinned" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityPinnedStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getCommunityPinnedByQuery = proxyquire(
      "../../../../../src/db-layer/main/CommunityPinned/utils/getCommunityPinnedByQuery",
      {
        models: { CommunityPinned: CommunityPinnedStub },
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

  describe("getCommunityPinnedByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getCommunityPinnedByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test CommunityPinned",
      });
      sinon.assert.calledOnce(CommunityPinnedStub.findOne);
      sinon.assert.calledWith(CommunityPinnedStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      CommunityPinnedStub.findOne.resolves(null);

      const result = await getCommunityPinnedByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(CommunityPinnedStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCommunityPinnedByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCommunityPinnedByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      CommunityPinnedStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getCommunityPinnedByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityPinnedByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      CommunityPinnedStub.findOne.resolves({ getData: () => undefined });

      const result = await getCommunityPinnedByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
