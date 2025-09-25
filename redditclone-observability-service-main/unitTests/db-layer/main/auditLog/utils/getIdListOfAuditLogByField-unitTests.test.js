const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfAuditLogByField module", () => {
  let sandbox;
  let getIdListOfAuditLogByField;
  let AuditLogStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AuditLogStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      timestamp: "example-type",
    };

    getIdListOfAuditLogByField = proxyquire(
      "../../../../../src/db-layer/main/AuditLog/utils/getIdListOfAuditLogByField",
      {
        models: { AuditLog: AuditLogStub },
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

  describe("getIdListOfAuditLogByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      AuditLogStub["timestamp"] = "string";
      const result = await getIdListOfAuditLogByField(
        "timestamp",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(AuditLogStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      AuditLogStub["timestamp"] = "string";
      const result = await getIdListOfAuditLogByField("timestamp", "val", true);
      const call = AuditLogStub.findAll.getCall(0);
      expect(call.args[0].where["timestamp"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfAuditLogByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      AuditLogStub["timestamp"] = 123; // expects number

      try {
        await getIdListOfAuditLogByField("timestamp", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      AuditLogStub.findAll.resolves([]);
      AuditLogStub["timestamp"] = "string";

      try {
        await getIdListOfAuditLogByField("timestamp", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "AuditLog with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      AuditLogStub.findAll.rejects(new Error("query failed"));
      AuditLogStub["timestamp"] = "string";

      try {
        await getIdListOfAuditLogByField("timestamp", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
