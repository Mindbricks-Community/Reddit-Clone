const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getMediaObjectAggById module", () => {
  let sandbox;
  let getMediaObjectAggById;
  let MediaObjectStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test MediaObject" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaObjectStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getMediaObjectAggById = proxyquire(
      "../../../../../src/db-layer/main/MediaObject/utils/getMediaObjectAggById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getMediaObjectAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getMediaObjectAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(MediaObjectStub.findOne);
      sinon.assert.calledOnce(MediaObjectStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getMediaObjectAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(MediaObjectStub.findAll);
      sinon.assert.calledOnce(MediaObjectStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      MediaObjectStub.findOne.resolves(null);
      const result = await getMediaObjectAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      MediaObjectStub.findAll.resolves([]);
      const result = await getMediaObjectAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      MediaObjectStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getMediaObjectAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      MediaObjectStub.findOne.resolves({ getData: () => undefined });
      const result = await getMediaObjectAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      MediaObjectStub.findOne.rejects(new Error("fail"));
      try {
        await getMediaObjectAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMediaObjectAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      MediaObjectStub.findAll.rejects(new Error("all fail"));
      try {
        await getMediaObjectAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMediaObjectAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      MediaObjectStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getMediaObjectAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMediaObjectAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
