const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfCommunityRuleByField module", () => {
  let sandbox;
  let getIdListOfCommunityRuleByField;
  let CommunityRuleStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityRuleStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      communityId: "example-type",
    };

    getIdListOfCommunityRuleByField = proxyquire(
      "../../../../../src/db-layer/main/CommunityRule/utils/getIdListOfCommunityRuleByField",
      {
        models: { CommunityRule: CommunityRuleStub },
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

  describe("getIdListOfCommunityRuleByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      CommunityRuleStub["communityId"] = "string";
      const result = await getIdListOfCommunityRuleByField(
        "communityId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(CommunityRuleStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      CommunityRuleStub["communityId"] = "string";
      const result = await getIdListOfCommunityRuleByField(
        "communityId",
        "val",
        true,
      );
      const call = CommunityRuleStub.findAll.getCall(0);
      expect(call.args[0].where["communityId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfCommunityRuleByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      CommunityRuleStub["communityId"] = 123; // expects number

      try {
        await getIdListOfCommunityRuleByField(
          "communityId",
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
      CommunityRuleStub.findAll.resolves([]);
      CommunityRuleStub["communityId"] = "string";

      try {
        await getIdListOfCommunityRuleByField("communityId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "CommunityRule with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      CommunityRuleStub.findAll.rejects(new Error("query failed"));
      CommunityRuleStub["communityId"] = "string";

      try {
        await getIdListOfCommunityRuleByField("communityId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
