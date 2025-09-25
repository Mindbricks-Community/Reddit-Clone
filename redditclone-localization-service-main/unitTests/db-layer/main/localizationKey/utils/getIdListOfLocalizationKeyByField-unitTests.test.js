const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfLocalizationKeyByField module", () => {
  let sandbox;
  let getIdListOfLocalizationKeyByField;
  let LocalizationKeyStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationKeyStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      uiKey: "example-type",
    };

    getIdListOfLocalizationKeyByField = proxyquire(
      "../../../../../src/db-layer/main/LocalizationKey/utils/getIdListOfLocalizationKeyByField",
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

  describe("getIdListOfLocalizationKeyByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      LocalizationKeyStub["uiKey"] = "string";
      const result = await getIdListOfLocalizationKeyByField(
        "uiKey",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(LocalizationKeyStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      LocalizationKeyStub["uiKey"] = "string";
      const result = await getIdListOfLocalizationKeyByField(
        "uiKey",
        "val",
        true,
      );
      const call = LocalizationKeyStub.findAll.getCall(0);
      expect(call.args[0].where["uiKey"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfLocalizationKeyByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      LocalizationKeyStub["uiKey"] = 123; // expects number

      try {
        await getIdListOfLocalizationKeyByField("uiKey", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      LocalizationKeyStub.findAll.resolves([]);
      LocalizationKeyStub["uiKey"] = "string";

      try {
        await getIdListOfLocalizationKeyByField("uiKey", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "LocalizationKey with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      LocalizationKeyStub.findAll.rejects(new Error("query failed"));
      LocalizationKeyStub["uiKey"] = "string";

      try {
        await getIdListOfLocalizationKeyByField("uiKey", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
