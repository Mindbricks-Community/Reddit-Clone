const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getLocalizationStringById module", () => {
  let sandbox;
  let getLocalizationStringById;
  let LocalizationStringStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test LocalizationString" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationStringStub = {
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

    getLocalizationStringById = proxyquire(
      "../../../../../src/db-layer/main/LocalizationString/utils/getLocalizationStringById",
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

  describe("getLocalizationStringById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getLocalizationStringById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(LocalizationStringStub.findOne);
      sinon.assert.calledWith(
        LocalizationStringStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getLocalizationStringById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(LocalizationStringStub.findAll);
      sinon.assert.calledWithMatch(LocalizationStringStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      LocalizationStringStub.findOne.resolves(null);
      const result = await getLocalizationStringById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      LocalizationStringStub.findAll.resolves([]);
      const result = await getLocalizationStringById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      LocalizationStringStub.findOne.rejects(new Error("DB failure"));
      try {
        await getLocalizationStringById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingLocalizationStringById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      LocalizationStringStub.findAll.rejects(new Error("array failure"));
      try {
        await getLocalizationStringById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingLocalizationStringById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      LocalizationStringStub.findOne.resolves({ getData: () => undefined });
      const result = await getLocalizationStringById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      LocalizationStringStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getLocalizationStringById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
