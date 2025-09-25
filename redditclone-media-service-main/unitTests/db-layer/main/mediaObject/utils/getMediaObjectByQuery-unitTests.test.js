const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getMediaObjectByQuery module", () => {
  let sandbox;
  let getMediaObjectByQuery;
  let MediaObjectStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test MediaObject",
    getData: () => ({ id: fakeId, name: "Test MediaObject" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaObjectStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getMediaObjectByQuery = proxyquire(
      "../../../../../src/db-layer/main/MediaObject/utils/getMediaObjectByQuery",
      {
        models: { MediaObject: MediaObjectStub },
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

  describe("getMediaObjectByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getMediaObjectByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test MediaObject" });
      sinon.assert.calledOnce(MediaObjectStub.findOne);
      sinon.assert.calledWith(MediaObjectStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      MediaObjectStub.findOne.resolves(null);

      const result = await getMediaObjectByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(MediaObjectStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getMediaObjectByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getMediaObjectByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      MediaObjectStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getMediaObjectByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMediaObjectByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      MediaObjectStub.findOne.resolves({ getData: () => undefined });

      const result = await getMediaObjectByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
