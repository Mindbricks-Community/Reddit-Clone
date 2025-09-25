const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfErrorLogByField module", () => {
  let sandbox;
  let getIdListOfErrorLogByField;
  let ErrorLogStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ErrorLogStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      timestamp: "example-type",
    };

    getIdListOfErrorLogByField = proxyquire(
      "../../../../../src/db-layer/main/ErrorLog/utils/getIdListOfErrorLogByField",
      {
        models: { ErrorLog: ErrorLogStub },
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

  describe("getIdListOfErrorLogByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      ErrorLogStub["timestamp"] = "string";
      const result = await getIdListOfErrorLogByField(
        "timestamp",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(ErrorLogStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      ErrorLogStub["timestamp"] = "string";
      const result = await getIdListOfErrorLogByField("timestamp", "val", true);
      const call = ErrorLogStub.findAll.getCall(0);
      expect(call.args[0].where["timestamp"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfErrorLogByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      ErrorLogStub["timestamp"] = 123; // expects number

      try {
        await getIdListOfErrorLogByField("timestamp", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      ErrorLogStub.findAll.resolves([]);
      ErrorLogStub["timestamp"] = "string";

      try {
        await getIdListOfErrorLogByField("timestamp", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "ErrorLog with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      ErrorLogStub.findAll.rejects(new Error("query failed"));
      ErrorLogStub["timestamp"] = "string";

      try {
        await getIdListOfErrorLogByField("timestamp", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
