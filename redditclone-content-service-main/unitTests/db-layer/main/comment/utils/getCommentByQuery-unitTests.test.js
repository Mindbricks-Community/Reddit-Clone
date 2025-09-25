const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCommentByQuery module", () => {
  let sandbox;
  let getCommentByQuery;
  let CommentStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test Comment",
    getData: () => ({ id: fakeId, name: "Test Comment" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommentStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getCommentByQuery = proxyquire(
      "../../../../../src/db-layer/main/Comment/utils/getCommentByQuery",
      {
        models: { Comment: CommentStub },
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

  describe("getCommentByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getCommentByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test Comment" });
      sinon.assert.calledOnce(CommentStub.findOne);
      sinon.assert.calledWith(CommentStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      CommentStub.findOne.resolves(null);

      const result = await getCommentByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(CommentStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCommentByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCommentByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      CommentStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getCommentByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommentByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      CommentStub.findOne.resolves({ getData: () => undefined });

      const result = await getCommentByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
