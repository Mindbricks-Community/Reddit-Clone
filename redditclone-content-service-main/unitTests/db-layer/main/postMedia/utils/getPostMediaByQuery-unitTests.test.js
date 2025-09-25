const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getPostMediaByQuery module", () => {
  let sandbox;
  let getPostMediaByQuery;
  let PostMediaStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test PostMedia",
    getData: () => ({ id: fakeId, name: "Test PostMedia" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PostMediaStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getPostMediaByQuery = proxyquire(
      "../../../../../src/db-layer/main/PostMedia/utils/getPostMediaByQuery",
      {
        models: { PostMedia: PostMediaStub },
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

  describe("getPostMediaByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getPostMediaByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test PostMedia" });
      sinon.assert.calledOnce(PostMediaStub.findOne);
      sinon.assert.calledWith(PostMediaStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      PostMediaStub.findOne.resolves(null);

      const result = await getPostMediaByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(PostMediaStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getPostMediaByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getPostMediaByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      PostMediaStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getPostMediaByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPostMediaByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      PostMediaStub.findOne.resolves({ getData: () => undefined });

      const result = await getPostMediaByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
