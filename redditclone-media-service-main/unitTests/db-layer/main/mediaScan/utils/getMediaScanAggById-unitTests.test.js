const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getMediaScanAggById module", () => {
  let sandbox;
  let getMediaScanAggById;
  let MediaScanStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test MediaScan" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaScanStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getMediaScanAggById = proxyquire(
      "../../../../../src/db-layer/main/MediaScan/utils/getMediaScanAggById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getMediaScanAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getMediaScanAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(MediaScanStub.findOne);
      sinon.assert.calledOnce(MediaScanStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getMediaScanAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(MediaScanStub.findAll);
      sinon.assert.calledOnce(MediaScanStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      MediaScanStub.findOne.resolves(null);
      const result = await getMediaScanAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      MediaScanStub.findAll.resolves([]);
      const result = await getMediaScanAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      MediaScanStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getMediaScanAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      MediaScanStub.findOne.resolves({ getData: () => undefined });
      const result = await getMediaScanAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      MediaScanStub.findOne.rejects(new Error("fail"));
      try {
        await getMediaScanAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMediaScanAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      MediaScanStub.findAll.rejects(new Error("all fail"));
      try {
        await getMediaScanAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMediaScanAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      MediaScanStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getMediaScanAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMediaScanAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
