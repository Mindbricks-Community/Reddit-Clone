const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfCommunityMemberByField module", () => {
  let sandbox;
  let getIdListOfCommunityMemberByField;
  let CommunityMemberStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityMemberStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      communityId: "example-type",
    };

    getIdListOfCommunityMemberByField = proxyquire(
      "../../../../../src/db-layer/main/CommunityMember/utils/getIdListOfCommunityMemberByField",
      {
        models: { CommunityMember: CommunityMemberStub },
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

  describe("getIdListOfCommunityMemberByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      CommunityMemberStub["communityId"] = "string";
      const result = await getIdListOfCommunityMemberByField(
        "communityId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(CommunityMemberStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      CommunityMemberStub["communityId"] = "string";
      const result = await getIdListOfCommunityMemberByField(
        "communityId",
        "val",
        true,
      );
      const call = CommunityMemberStub.findAll.getCall(0);
      expect(call.args[0].where["communityId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfCommunityMemberByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      CommunityMemberStub["communityId"] = 123; // expects number

      try {
        await getIdListOfCommunityMemberByField(
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
      CommunityMemberStub.findAll.resolves([]);
      CommunityMemberStub["communityId"] = "string";

      try {
        await getIdListOfCommunityMemberByField(
          "communityId",
          "nomatch",
          false,
        );
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "CommunityMember with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      CommunityMemberStub.findAll.rejects(new Error("query failed"));
      CommunityMemberStub["communityId"] = "string";

      try {
        await getIdListOfCommunityMemberByField("communityId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
