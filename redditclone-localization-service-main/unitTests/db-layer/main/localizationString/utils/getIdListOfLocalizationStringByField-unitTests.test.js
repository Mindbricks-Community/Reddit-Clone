const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfLocalizationStringByField module", () => {
  let sandbox;
  let getIdListOfLocalizationStringByField;
  let LocalizationStringStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationStringStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      keyId: "example-type",
    };

    getIdListOfLocalizationStringByField = proxyquire(
      "../../../../../src/db-layer/main/LocalizationString/utils/getIdListOfLocalizationStringByField",
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

  describe("getIdListOfLocalizationStringByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      LocalizationStringStub["keyId"] = "string";
      const result = await getIdListOfLocalizationStringByField(
        "keyId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(LocalizationStringStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      LocalizationStringStub["keyId"] = "string";
      const result = await getIdListOfLocalizationStringByField(
        "keyId",
        "val",
        true,
      );
      const call = LocalizationStringStub.findAll.getCall(0);
      expect(call.args[0].where["keyId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfLocalizationStringByField(
          "nonexistentField",
          "x",
          false,
        );
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      LocalizationStringStub["keyId"] = 123; // expects number

      try {
        await getIdListOfLocalizationStringByField(
          "keyId",
          "wrong-type",
          false,
        );
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      LocalizationStringStub.findAll.resolves([]);
      LocalizationStringStub["keyId"] = "string";

      try {
        await getIdListOfLocalizationStringByField("keyId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "LocalizationString with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      LocalizationStringStub.findAll.rejects(new Error("query failed"));
      LocalizationStringStub["keyId"] = "string";

      try {
        await getIdListOfLocalizationStringByField("keyId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
