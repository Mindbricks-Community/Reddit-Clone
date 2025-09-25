const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfGlobalUserRestrictionByField module", () => {
  let sandbox;
  let getIdListOfGlobalUserRestrictionByField;
  let GlobalUserRestrictionStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GlobalUserRestrictionStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      userId: "example-type",
    };

    getIdListOfGlobalUserRestrictionByField = proxyquire(
      "../../../../../src/db-layer/main/GlobalUserRestriction/utils/getIdListOfGlobalUserRestrictionByField",
      {
        models: { GlobalUserRestriction: GlobalUserRestrictionStub },
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

  describe("getIdListOfGlobalUserRestrictionByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      GlobalUserRestrictionStub["userId"] = "string";
      const result = await getIdListOfGlobalUserRestrictionByField(
        "userId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(GlobalUserRestrictionStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      GlobalUserRestrictionStub["userId"] = "string";
      const result = await getIdListOfGlobalUserRestrictionByField(
        "userId",
        "val",
        true,
      );
      const call = GlobalUserRestrictionStub.findAll.getCall(0);
      expect(call.args[0].where["userId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfGlobalUserRestrictionByField(
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
      GlobalUserRestrictionStub["userId"] = 123; // expects number

      try {
        await getIdListOfGlobalUserRestrictionByField(
          "userId",
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
      GlobalUserRestrictionStub.findAll.resolves([]);
      GlobalUserRestrictionStub["userId"] = "string";

      try {
        await getIdListOfGlobalUserRestrictionByField(
          "userId",
          "nomatch",
          false,
        );
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "GlobalUserRestriction with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      GlobalUserRestrictionStub.findAll.rejects(new Error("query failed"));
      GlobalUserRestrictionStub["userId"] = "string";

      try {
        await getIdListOfGlobalUserRestrictionByField("userId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
