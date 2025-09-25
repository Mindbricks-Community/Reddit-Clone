const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getLocalizationKeyByQuery module", () => {
  let sandbox;
  let getLocalizationKeyByQuery;
  let LocalizationKeyStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test LocalizationKey",
    getData: () => ({ id: fakeId, name: "Test LocalizationKey" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationKeyStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getLocalizationKeyByQuery = proxyquire(
      "../../../../../src/db-layer/main/LocalizationKey/utils/getLocalizationKeyByQuery",
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

  describe("getLocalizationKeyByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getLocalizationKeyByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test LocalizationKey",
      });
      sinon.assert.calledOnce(LocalizationKeyStub.findOne);
      sinon.assert.calledWith(LocalizationKeyStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      LocalizationKeyStub.findOne.resolves(null);

      const result = await getLocalizationKeyByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(LocalizationKeyStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getLocalizationKeyByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getLocalizationKeyByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      LocalizationKeyStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getLocalizationKeyByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingLocalizationKeyByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      LocalizationKeyStub.findOne.resolves({ getData: () => undefined });

      const result = await getLocalizationKeyByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
