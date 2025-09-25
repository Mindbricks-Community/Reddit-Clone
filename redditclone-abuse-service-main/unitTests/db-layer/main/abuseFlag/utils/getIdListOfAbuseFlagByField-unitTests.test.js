const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfAbuseFlagByField module", () => {
  let sandbox;
  let getIdListOfAbuseFlagByField;
  let AbuseFlagStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseFlagStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      flagType: "example-type",
    };

    getIdListOfAbuseFlagByField = proxyquire(
      "../../../../../src/db-layer/main/AbuseFlag/utils/getIdListOfAbuseFlagByField",
      {
        models: { AbuseFlag: AbuseFlagStub },
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

  describe("getIdListOfAbuseFlagByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      AbuseFlagStub["flagType"] = "string";
      const result = await getIdListOfAbuseFlagByField(
        "flagType",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(AbuseFlagStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      AbuseFlagStub["flagType"] = "string";
      const result = await getIdListOfAbuseFlagByField("flagType", "val", true);
      const call = AbuseFlagStub.findAll.getCall(0);
      expect(call.args[0].where["flagType"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfAbuseFlagByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      AbuseFlagStub["flagType"] = 123; // expects number

      try {
        await getIdListOfAbuseFlagByField("flagType", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      AbuseFlagStub.findAll.resolves([]);
      AbuseFlagStub["flagType"] = "string";

      try {
        await getIdListOfAbuseFlagByField("flagType", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "AbuseFlag with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      AbuseFlagStub.findAll.rejects(new Error("query failed"));
      AbuseFlagStub["flagType"] = "string";

      try {
        await getIdListOfAbuseFlagByField("flagType", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
