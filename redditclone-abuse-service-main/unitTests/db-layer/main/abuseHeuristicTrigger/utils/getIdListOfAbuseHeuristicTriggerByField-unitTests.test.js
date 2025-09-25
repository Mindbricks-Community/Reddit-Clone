const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfAbuseHeuristicTriggerByField module", () => {
  let sandbox;
  let getIdListOfAbuseHeuristicTriggerByField;
  let AbuseHeuristicTriggerStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseHeuristicTriggerStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      triggerType: "example-type",
    };

    getIdListOfAbuseHeuristicTriggerByField = proxyquire(
      "../../../../../src/db-layer/main/AbuseHeuristicTrigger/utils/getIdListOfAbuseHeuristicTriggerByField",
      {
        models: { AbuseHeuristicTrigger: AbuseHeuristicTriggerStub },
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

  describe("getIdListOfAbuseHeuristicTriggerByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      AbuseHeuristicTriggerStub["triggerType"] = "string";
      const result = await getIdListOfAbuseHeuristicTriggerByField(
        "triggerType",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(AbuseHeuristicTriggerStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      AbuseHeuristicTriggerStub["triggerType"] = "string";
      const result = await getIdListOfAbuseHeuristicTriggerByField(
        "triggerType",
        "val",
        true,
      );
      const call = AbuseHeuristicTriggerStub.findAll.getCall(0);
      expect(call.args[0].where["triggerType"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfAbuseHeuristicTriggerByField(
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
      AbuseHeuristicTriggerStub["triggerType"] = 123; // expects number

      try {
        await getIdListOfAbuseHeuristicTriggerByField(
          "triggerType",
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
      AbuseHeuristicTriggerStub.findAll.resolves([]);
      AbuseHeuristicTriggerStub["triggerType"] = "string";

      try {
        await getIdListOfAbuseHeuristicTriggerByField(
          "triggerType",
          "nomatch",
          false,
        );
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "AbuseHeuristicTrigger with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      AbuseHeuristicTriggerStub.findAll.rejects(new Error("query failed"));
      AbuseHeuristicTriggerStub["triggerType"] = "string";

      try {
        await getIdListOfAbuseHeuristicTriggerByField(
          "triggerType",
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
