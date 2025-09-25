const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getMediaScanByQuery module", () => {
  let sandbox;
  let getMediaScanByQuery;
  let MediaScanStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test MediaScan",
    getData: () => ({ id: fakeId, name: "Test MediaScan" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaScanStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getMediaScanByQuery = proxyquire(
      "../../../../../src/db-layer/main/MediaScan/utils/getMediaScanByQuery",
      {
        models: { MediaScan: MediaScanStub },
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

  describe("getMediaScanByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getMediaScanByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test MediaScan" });
      sinon.assert.calledOnce(MediaScanStub.findOne);
      sinon.assert.calledWith(MediaScanStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      MediaScanStub.findOne.resolves(null);

      const result = await getMediaScanByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(MediaScanStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getMediaScanByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getMediaScanByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      MediaScanStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getMediaScanByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMediaScanByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      MediaScanStub.findOne.resolves({ getData: () => undefined });

      const result = await getMediaScanByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
