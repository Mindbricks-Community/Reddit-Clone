const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfCompliancePolicyByField module", () => {
  let sandbox;
  let getIdListOfCompliancePolicyByField;
  let CompliancePolicyStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CompliancePolicyStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      minAge: "example-type",
    };

    getIdListOfCompliancePolicyByField = proxyquire(
      "../../../../../src/db-layer/main/CompliancePolicy/utils/getIdListOfCompliancePolicyByField",
      {
        models: { CompliancePolicy: CompliancePolicyStub },
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

  describe("getIdListOfCompliancePolicyByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      CompliancePolicyStub["minAge"] = "string";
      const result = await getIdListOfCompliancePolicyByField(
        "minAge",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(CompliancePolicyStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      CompliancePolicyStub["minAge"] = "string";
      const result = await getIdListOfCompliancePolicyByField(
        "minAge",
        "val",
        true,
      );
      const call = CompliancePolicyStub.findAll.getCall(0);
      expect(call.args[0].where["minAge"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfCompliancePolicyByField(
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
      CompliancePolicyStub["minAge"] = 123; // expects number

      try {
        await getIdListOfCompliancePolicyByField("minAge", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      CompliancePolicyStub.findAll.resolves([]);
      CompliancePolicyStub["minAge"] = "string";

      try {
        await getIdListOfCompliancePolicyByField("minAge", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "CompliancePolicy with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      CompliancePolicyStub.findAll.rejects(new Error("query failed"));
      CompliancePolicyStub["minAge"] = "string";

      try {
        await getIdListOfCompliancePolicyByField("minAge", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
