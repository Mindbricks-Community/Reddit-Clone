const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getLocaleById module", () => {
  let sandbox;
  let getLocaleById;
  let LocaleStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Locale" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocaleStub = {
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

    getLocaleById = proxyquire(
      "../../../../../src/db-layer/main/Locale/utils/getLocaleById",
      {
        models: { Locale: LocaleStub },
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

  describe("getLocaleById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getLocaleById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(LocaleStub.findOne);
      sinon.assert.calledWith(
        LocaleStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getLocaleById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(LocaleStub.findAll);
      sinon.assert.calledWithMatch(LocaleStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      LocaleStub.findOne.resolves(null);
      const result = await getLocaleById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      LocaleStub.findAll.resolves([]);
      const result = await getLocaleById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      LocaleStub.findOne.rejects(new Error("DB failure"));
      try {
        await getLocaleById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingLocaleById");
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      LocaleStub.findAll.rejects(new Error("array failure"));
      try {
        await getLocaleById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingLocaleById");
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      LocaleStub.findOne.resolves({ getData: () => undefined });
      const result = await getLocaleById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      LocaleStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getLocaleById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
