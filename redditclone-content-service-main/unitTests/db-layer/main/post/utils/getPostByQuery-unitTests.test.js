const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getPostByQuery module", () => {
  let sandbox;
  let getPostByQuery;
  let PostStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test Post",
    getData: () => ({ id: fakeId, name: "Test Post" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PostStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getPostByQuery = proxyquire(
      "../../../../../src/db-layer/main/Post/utils/getPostByQuery",
      {
        models: { Post: PostStub },
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

  describe("getPostByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getPostByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test Post" });
      sinon.assert.calledOnce(PostStub.findOne);
      sinon.assert.calledWith(PostStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      PostStub.findOne.resolves(null);

      const result = await getPostByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(PostStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getPostByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getPostByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      PostStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getPostByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingPostByQuery");
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      PostStub.findOne.resolves({ getData: () => undefined });

      const result = await getPostByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
