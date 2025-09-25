const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfAbuseReportByField module", () => {
  let sandbox;
  let getIdListOfAbuseReportByField;
  let AbuseReportStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseReportStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      reportType: "example-type",
    };

    getIdListOfAbuseReportByField = proxyquire(
      "../../../../../src/db-layer/main/AbuseReport/utils/getIdListOfAbuseReportByField",
      {
        models: { AbuseReport: AbuseReportStub },
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

  describe("getIdListOfAbuseReportByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      AbuseReportStub["reportType"] = "string";
      const result = await getIdListOfAbuseReportByField(
        "reportType",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(AbuseReportStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      AbuseReportStub["reportType"] = "string";
      const result = await getIdListOfAbuseReportByField(
        "reportType",
        "val",
        true,
      );
      const call = AbuseReportStub.findAll.getCall(0);
      expect(call.args[0].where["reportType"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfAbuseReportByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      AbuseReportStub["reportType"] = 123; // expects number

      try {
        await getIdListOfAbuseReportByField("reportType", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      AbuseReportStub.findAll.resolves([]);
      AbuseReportStub["reportType"] = "string";

      try {
        await getIdListOfAbuseReportByField("reportType", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "AbuseReport with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      AbuseReportStub.findAll.rejects(new Error("query failed"));
      AbuseReportStub["reportType"] = "string";

      try {
        await getIdListOfAbuseReportByField("reportType", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
