const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getLocaleByQuery module", () => {
  let sandbox;
  let getLocaleByQuery;
  let LocaleStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test Locale",
    getData: () => ({ id: fakeId, name: "Test Locale" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocaleStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getLocaleByQuery = proxyquire(
      "../../../../../src/db-layer/main/Locale/utils/getLocaleByQuery",
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

  describe("getLocaleByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getLocaleByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test Locale" });
      sinon.assert.calledOnce(LocaleStub.findOne);
      sinon.assert.calledWith(LocaleStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      LocaleStub.findOne.resolves(null);

      const result = await getLocaleByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(LocaleStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getLocaleByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getLocaleByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      LocaleStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getLocaleByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingLocaleByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      LocaleStub.findOne.resolves({ getData: () => undefined });

      const result = await getLocaleByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
