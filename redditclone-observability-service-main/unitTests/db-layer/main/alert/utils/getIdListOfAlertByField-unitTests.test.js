const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfAlertByField module", () => {
  let sandbox;
  let getIdListOfAlertByField;
  let AlertStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AlertStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      title: "example-type",
    };

    getIdListOfAlertByField = proxyquire(
      "../../../../../src/db-layer/main/Alert/utils/getIdListOfAlertByField",
      {
        models: { Alert: AlertStub },
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

  describe("getIdListOfAlertByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      AlertStub["title"] = "string";
      const result = await getIdListOfAlertByField(
        "title",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(AlertStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      AlertStub["title"] = "string";
      const result = await getIdListOfAlertByField("title", "val", true);
      const call = AlertStub.findAll.getCall(0);
      expect(call.args[0].where["title"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfAlertByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      AlertStub["title"] = 123; // expects number

      try {
        await getIdListOfAlertByField("title", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      AlertStub.findAll.resolves([]);
      AlertStub["title"] = "string";

      try {
        await getIdListOfAlertByField("title", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "Alert with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      AlertStub.findAll.rejects(new Error("query failed"));
      AlertStub["title"] = "string";

      try {
        await getIdListOfAlertByField("title", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
