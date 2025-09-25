const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfModerationAuditLogByField module", () => {
  let sandbox;
  let getIdListOfModerationAuditLogByField;
  let ModerationAuditLogStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationAuditLogStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      logEntryType: "example-type",
    };

    getIdListOfModerationAuditLogByField = proxyquire(
      "../../../../../src/db-layer/main/ModerationAuditLog/utils/getIdListOfModerationAuditLogByField",
      {
        models: { ModerationAuditLog: ModerationAuditLogStub },
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

  describe("getIdListOfModerationAuditLogByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      ModerationAuditLogStub["logEntryType"] = "string";
      const result = await getIdListOfModerationAuditLogByField(
        "logEntryType",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(ModerationAuditLogStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      ModerationAuditLogStub["logEntryType"] = "string";
      const result = await getIdListOfModerationAuditLogByField(
        "logEntryType",
        "val",
        true,
      );
      const call = ModerationAuditLogStub.findAll.getCall(0);
      expect(call.args[0].where["logEntryType"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfModerationAuditLogByField(
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
      ModerationAuditLogStub["logEntryType"] = 123; // expects number

      try {
        await getIdListOfModerationAuditLogByField(
          "logEntryType",
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
      ModerationAuditLogStub.findAll.resolves([]);
      ModerationAuditLogStub["logEntryType"] = "string";

      try {
        await getIdListOfModerationAuditLogByField(
          "logEntryType",
          "nomatch",
          false,
        );
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "ModerationAuditLog with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      ModerationAuditLogStub.findAll.rejects(new Error("query failed"));
      ModerationAuditLogStub["logEntryType"] = "string";

      try {
        await getIdListOfModerationAuditLogByField(
          "logEntryType",
          "test",
          false,
        );
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
