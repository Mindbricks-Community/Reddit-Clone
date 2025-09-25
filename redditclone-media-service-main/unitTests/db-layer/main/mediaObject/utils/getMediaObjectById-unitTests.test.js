const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getMediaObjectById module", () => {
  let sandbox;
  let getMediaObjectById;
  let MediaObjectStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test MediaObject" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaObjectStub = {
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

    getMediaObjectById = proxyquire(
      "../../../../../src/db-layer/main/MediaObject/utils/getMediaObjectById",
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

  describe("getMediaObjectById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getMediaObjectById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(MediaObjectStub.findOne);
      sinon.assert.calledWith(
        MediaObjectStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getMediaObjectById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(MediaObjectStub.findAll);
      sinon.assert.calledWithMatch(MediaObjectStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      MediaObjectStub.findOne.resolves(null);
      const result = await getMediaObjectById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      MediaObjectStub.findAll.resolves([]);
      const result = await getMediaObjectById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      MediaObjectStub.findOne.rejects(new Error("DB failure"));
      try {
        await getMediaObjectById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMediaObjectById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      MediaObjectStub.findAll.rejects(new Error("array failure"));
      try {
        await getMediaObjectById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingMediaObjectById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      MediaObjectStub.findOne.resolves({ getData: () => undefined });
      const result = await getMediaObjectById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      MediaObjectStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getMediaObjectById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
