const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getLocalizationKeyAggById module", () => {
  let sandbox;
  let getLocalizationKeyAggById;
  let LocalizationKeyStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test LocalizationKey" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationKeyStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getLocalizationKeyAggById = proxyquire(
      "../../../../../src/db-layer/main/LocalizationKey/utils/getLocalizationKeyAggById",
      {
        models: { LocalizationKey: LocalizationKeyStub },
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

  describe("getLocalizationKeyAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getLocalizationKeyAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(LocalizationKeyStub.findOne);
      sinon.assert.calledOnce(LocalizationKeyStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getLocalizationKeyAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(LocalizationKeyStub.findAll);
      sinon.assert.calledOnce(LocalizationKeyStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      LocalizationKeyStub.findOne.resolves(null);
      const result = await getLocalizationKeyAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      LocalizationKeyStub.findAll.resolves([]);
      const result = await getLocalizationKeyAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      LocalizationKeyStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getLocalizationKeyAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      LocalizationKeyStub.findOne.resolves({ getData: () => undefined });
      const result = await getLocalizationKeyAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      LocalizationKeyStub.findOne.rejects(new Error("fail"));
      try {
        await getLocalizationKeyAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingLocalizationKeyAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      LocalizationKeyStub.findAll.rejects(new Error("all fail"));
      try {
        await getLocalizationKeyAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingLocalizationKeyAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      LocalizationKeyStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getLocalizationKeyAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingLocalizationKeyAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
