const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfCommunityPinnedByField module", () => {
  let sandbox;
  let getIdListOfCommunityPinnedByField;
  let CommunityPinnedStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityPinnedStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      communityId: "example-type",
    };

    getIdListOfCommunityPinnedByField = proxyquire(
      "../../../../../src/db-layer/main/CommunityPinned/utils/getIdListOfCommunityPinnedByField",
      {
        models: { CommunityPinned: CommunityPinnedStub },
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

  describe("getIdListOfCommunityPinnedByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      CommunityPinnedStub["communityId"] = "string";
      const result = await getIdListOfCommunityPinnedByField(
        "communityId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(CommunityPinnedStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      CommunityPinnedStub["communityId"] = "string";
      const result = await getIdListOfCommunityPinnedByField(
        "communityId",
        "val",
        true,
      );
      const call = CommunityPinnedStub.findAll.getCall(0);
      expect(call.args[0].where["communityId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfCommunityPinnedByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      CommunityPinnedStub["communityId"] = 123; // expects number

      try {
        await getIdListOfCommunityPinnedByField(
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
      CommunityPinnedStub.findAll.resolves([]);
      CommunityPinnedStub["communityId"] = "string";

      try {
        await getIdListOfCommunityPinnedByField(
          "communityId",
          "nomatch",
          false,
        );
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "CommunityPinned with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      CommunityPinnedStub.findAll.rejects(new Error("query failed"));
      CommunityPinnedStub["communityId"] = "string";

      try {
        await getIdListOfCommunityPinnedByField("communityId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
