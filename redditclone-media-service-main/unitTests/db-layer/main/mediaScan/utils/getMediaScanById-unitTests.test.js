const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getMediaScanById module", () => {
  let sandbox;
  let getMediaScanById;
  let MediaScanStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test MediaScan" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaScanStub = {
      findOne: sandbox.stub().resolves({
        getData: () => fakeData,
      }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
    };

    getMediaScanById = proxyquire(
      "../../../../../src/db-layer/main/MediaScan/utils/getMediaScanById",
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

  describe("getMediaScanById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getMediaScanById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(MediaScanStub.findOne);
      sinon.assert.calledWith(
        MediaScanStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getMediaScanById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(MediaScanStub.findAll);
      sinon.assert.calledWithMatch(MediaScanStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      MediaScanStub.findOne.resolves(null);
      const result = await getMediaScanById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      MediaScanStub.findAll.resolves([]);
      const result = await getMediaScanById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      MediaScanStub.findOne.rejects(new Error("DB failure"));
      try {
        await getMediaScanById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMediaScanById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      MediaScanStub.findAll.rejects(new Error("array failure"));
      try {
        await getMediaScanById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMediaScanById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      MediaScanStub.findOne.resolves({ getData: () => undefined });
      const result = await getMediaScanById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      MediaScanStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getMediaScanById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
