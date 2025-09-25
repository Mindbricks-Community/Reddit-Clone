const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getLocalizationStringByQuery module", () => {
  let sandbox;
  let getLocalizationStringByQuery;
  let LocalizationStringStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test LocalizationString",
    getData: () => ({ id: fakeId, name: "Test LocalizationString" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationStringStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getLocalizationStringByQuery = proxyquire(
      "../../../../../src/db-layer/main/LocalizationString/utils/getLocalizationStringByQuery",
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

  describe("getLocalizationStringByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getLocalizationStringByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test LocalizationString",
      });
      sinon.assert.calledOnce(LocalizationStringStub.findOne);
      sinon.assert.calledWith(LocalizationStringStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      LocalizationStringStub.findOne.resolves(null);

      const result = await getLocalizationStringByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(LocalizationStringStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getLocalizationStringByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getLocalizationStringByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      LocalizationStringStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getLocalizationStringByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingLocalizationStringByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      LocalizationStringStub.findOne.resolves({ getData: () => undefined });

      const result = await getLocalizationStringByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
