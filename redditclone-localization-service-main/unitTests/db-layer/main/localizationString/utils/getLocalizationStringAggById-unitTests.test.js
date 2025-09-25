const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getLocalizationStringAggById module", () => {
  let sandbox;
  let getLocalizationStringAggById;
  let LocalizationStringStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test LocalizationString" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationStringStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getLocalizationStringAggById = proxyquire(
      "../../../../../src/db-layer/main/LocalizationString/utils/getLocalizationStringAggById",
      {
        models: { LocalizationString: LocalizationStringStub },
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

  describe("getLocalizationStringAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getLocalizationStringAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(LocalizationStringStub.findOne);
      sinon.assert.calledOnce(LocalizationStringStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getLocalizationStringAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(LocalizationStringStub.findAll);
      sinon.assert.calledOnce(LocalizationStringStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      LocalizationStringStub.findOne.resolves(null);
      const result = await getLocalizationStringAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      LocalizationStringStub.findAll.resolves([]);
      const result = await getLocalizationStringAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      LocalizationStringStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getLocalizationStringAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      LocalizationStringStub.findOne.resolves({ getData: () => undefined });
      const result = await getLocalizationStringAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      LocalizationStringStub.findOne.rejects(new Error("fail"));
      try {
        await getLocalizationStringAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingLocalizationStringAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      LocalizationStringStub.findAll.rejects(new Error("all fail"));
      try {
        await getLocalizationStringAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingLocalizationStringAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      LocalizationStringStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getLocalizationStringAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingLocalizationStringAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
