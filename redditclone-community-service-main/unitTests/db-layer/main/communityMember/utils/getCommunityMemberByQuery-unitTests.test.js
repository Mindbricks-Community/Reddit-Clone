const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCommunityMemberByQuery module", () => {
  let sandbox;
  let getCommunityMemberByQuery;
  let CommunityMemberStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test CommunityMember",
    getData: () => ({ id: fakeId, name: "Test CommunityMember" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityMemberStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getCommunityMemberByQuery = proxyquire(
      "../../../../../src/db-layer/main/CommunityMember/utils/getCommunityMemberByQuery",
      {
        models: { CommunityMember: CommunityMemberStub },
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

  describe("getCommunityMemberByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getCommunityMemberByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test CommunityMember",
      });
      sinon.assert.calledOnce(CommunityMemberStub.findOne);
      sinon.assert.calledWith(CommunityMemberStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      CommunityMemberStub.findOne.resolves(null);

      const result = await getCommunityMemberByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(CommunityMemberStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCommunityMemberByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCommunityMemberByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      CommunityMemberStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getCommunityMemberByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityMemberByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      CommunityMemberStub.findOne.resolves({ getData: () => undefined });

      const result = await getCommunityMemberByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
