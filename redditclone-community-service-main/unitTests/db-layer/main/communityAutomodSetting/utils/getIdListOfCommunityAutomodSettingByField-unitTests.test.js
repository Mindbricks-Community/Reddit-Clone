const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfCommunityAutomodSettingByField module", () => {
  let sandbox;
  let getIdListOfCommunityAutomodSettingByField;
  let CommunityAutomodSettingStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityAutomodSettingStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      communityId: "example-type",
    };

    getIdListOfCommunityAutomodSettingByField = proxyquire(
      "../../../../../src/db-layer/main/CommunityAutomodSetting/utils/getIdListOfCommunityAutomodSettingByField",
      {
        models: { CommunityAutomodSetting: CommunityAutomodSettingStub },
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

  describe("getIdListOfCommunityAutomodSettingByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      CommunityAutomodSettingStub["communityId"] = "string";
      const result = await getIdListOfCommunityAutomodSettingByField(
        "communityId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(CommunityAutomodSettingStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      CommunityAutomodSettingStub["communityId"] = "string";
      const result = await getIdListOfCommunityAutomodSettingByField(
        "communityId",
        "val",
        true,
      );
      const call = CommunityAutomodSettingStub.findAll.getCall(0);
      expect(call.args[0].where["communityId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfCommunityAutomodSettingByField(
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
      CommunityAutomodSettingStub["communityId"] = 123; // expects number

      try {
        await getIdListOfCommunityAutomodSettingByField(
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
      CommunityAutomodSettingStub.findAll.resolves([]);
      CommunityAutomodSettingStub["communityId"] = "string";

      try {
        await getIdListOfCommunityAutomodSettingByField(
          "communityId",
          "nomatch",
          false,
        );
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "CommunityAutomodSetting with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      CommunityAutomodSettingStub.findAll.rejects(new Error("query failed"));
      CommunityAutomodSettingStub["communityId"] = "string";

      try {
        await getIdListOfCommunityAutomodSettingByField(
          "communityId",
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
