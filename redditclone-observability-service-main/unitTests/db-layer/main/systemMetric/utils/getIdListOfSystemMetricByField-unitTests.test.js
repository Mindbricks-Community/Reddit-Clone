const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfSystemMetricByField module", () => {
  let sandbox;
  let getIdListOfSystemMetricByField;
  let SystemMetricStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    SystemMetricStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      timestamp: "example-type",
    };

    getIdListOfSystemMetricByField = proxyquire(
      "../../../../../src/db-layer/main/SystemMetric/utils/getIdListOfSystemMetricByField",
      {
        models: { SystemMetric: SystemMetricStub },
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

  describe("getIdListOfSystemMetricByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      SystemMetricStub["timestamp"] = "string";
      const result = await getIdListOfSystemMetricByField(
        "timestamp",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(SystemMetricStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      SystemMetricStub["timestamp"] = "string";
      const result = await getIdListOfSystemMetricByField(
        "timestamp",
        "val",
        true,
      );
      const call = SystemMetricStub.findAll.getCall(0);
      expect(call.args[0].where["timestamp"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfSystemMetricByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      SystemMetricStub["timestamp"] = 123; // expects number

      try {
        await getIdListOfSystemMetricByField("timestamp", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      SystemMetricStub.findAll.resolves([]);
      SystemMetricStub["timestamp"] = "string";

      try {
        await getIdListOfSystemMetricByField("timestamp", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "SystemMetric with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      SystemMetricStub.findAll.rejects(new Error("query failed"));
      SystemMetricStub["timestamp"] = "string";

      try {
        await getIdListOfSystemMetricByField("timestamp", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
