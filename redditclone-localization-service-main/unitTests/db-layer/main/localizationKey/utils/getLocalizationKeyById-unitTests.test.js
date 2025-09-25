const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getLocalizationKeyById module", () => {
  let sandbox;
  let getLocalizationKeyById;
  let LocalizationKeyStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test LocalizationKey" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationKeyStub = {
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

    getLocalizationKeyById = proxyquire(
      "../../../../../src/db-layer/main/LocalizationKey/utils/getLocalizationKeyById",
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

  describe("getLocalizationKeyById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getLocalizationKeyById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(LocalizationKeyStub.findOne);
      sinon.assert.calledWith(
        LocalizationKeyStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getLocalizationKeyById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(LocalizationKeyStub.findAll);
      sinon.assert.calledWithMatch(LocalizationKeyStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      LocalizationKeyStub.findOne.resolves(null);
      const result = await getLocalizationKeyById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      LocalizationKeyStub.findAll.resolves([]);
      const result = await getLocalizationKeyById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      LocalizationKeyStub.findOne.rejects(new Error("DB failure"));
      try {
        await getLocalizationKeyById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingLocalizationKeyById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      LocalizationKeyStub.findAll.rejects(new Error("array failure"));
      try {
        await getLocalizationKeyById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingLocalizationKeyById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      LocalizationKeyStub.findOne.resolves({ getData: () => undefined });
      const result = await getLocalizationKeyById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      LocalizationKeyStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getLocalizationKeyById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
