const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfAbuseInvestigationByField module", () => {
  let sandbox;
  let getIdListOfAbuseInvestigationByField;
  let AbuseInvestigationStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseInvestigationStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      investigationStatus: "example-type",
    };

    getIdListOfAbuseInvestigationByField = proxyquire(
      "../../../../../src/db-layer/main/AbuseInvestigation/utils/getIdListOfAbuseInvestigationByField",
      {
        models: { AbuseInvestigation: AbuseInvestigationStub },
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

  describe("getIdListOfAbuseInvestigationByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      AbuseInvestigationStub["investigationStatus"] = "string";
      const result = await getIdListOfAbuseInvestigationByField(
        "investigationStatus",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(AbuseInvestigationStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      AbuseInvestigationStub["investigationStatus"] = "string";
      const result = await getIdListOfAbuseInvestigationByField(
        "investigationStatus",
        "val",
        true,
      );
      const call = AbuseInvestigationStub.findAll.getCall(0);
      expect(call.args[0].where["investigationStatus"][Op.contains]).to.include(
        "val",
      );
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfAbuseInvestigationByField(
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
      AbuseInvestigationStub["investigationStatus"] = 123; // expects number

      try {
        await getIdListOfAbuseInvestigationByField(
          "investigationStatus",
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
      AbuseInvestigationStub.findAll.resolves([]);
      AbuseInvestigationStub["investigationStatus"] = "string";

      try {
        await getIdListOfAbuseInvestigationByField(
          "investigationStatus",
          "nomatch",
          false,
        );
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "AbuseInvestigation with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      AbuseInvestigationStub.findAll.rejects(new Error("query failed"));
      AbuseInvestigationStub["investigationStatus"] = "string";

      try {
        await getIdListOfAbuseInvestigationByField(
          "investigationStatus",
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
