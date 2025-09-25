const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfLocaleByField module", () => {
  let sandbox;
  let getIdListOfLocaleByField;
  let LocaleStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocaleStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      localeCode: "example-type",
    };

    getIdListOfLocaleByField = proxyquire(
      "../../../../../src/db-layer/main/Locale/utils/getIdListOfLocaleByField",
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
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getIdListOfLocaleByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      LocaleStub["localeCode"] = "string";
      const result = await getIdListOfLocaleByField(
        "localeCode",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(LocaleStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      LocaleStub["localeCode"] = "string";
      const result = await getIdListOfLocaleByField("localeCode", "val", true);
      const call = LocaleStub.findAll.getCall(0);
      expect(call.args[0].where["localeCode"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfLocaleByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      LocaleStub["localeCode"] = 123; // expects number

      try {
        await getIdListOfLocaleByField("localeCode", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      LocaleStub.findAll.resolves([]);
      LocaleStub["localeCode"] = "string";

      try {
        await getIdListOfLocaleByField("localeCode", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "Locale with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      LocaleStub.findAll.rejects(new Error("query failed"));
      LocaleStub["localeCode"] = "string";

      try {
        await getIdListOfLocaleByField("localeCode", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
