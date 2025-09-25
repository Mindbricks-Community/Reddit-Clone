const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getVoteByQuery module", () => {
  let sandbox;
  let getVoteByQuery;
  let VoteStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test Vote",
    getData: () => ({ id: fakeId, name: "Test Vote" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    VoteStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getVoteByQuery = proxyquire(
      "../../../../../src/db-layer/main/Vote/utils/getVoteByQuery",
      {
        models: { Vote: VoteStub },
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

  describe("getVoteByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getVoteByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test Vote" });
      sinon.assert.calledOnce(VoteStub.findOne);
      sinon.assert.calledWith(VoteStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      VoteStub.findOne.resolves(null);

      const result = await getVoteByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(VoteStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getVoteByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getVoteByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      VoteStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getVoteByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingVoteByQuery");
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      VoteStub.findOne.resolves({ getData: () => undefined });

      const result = await getVoteByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
