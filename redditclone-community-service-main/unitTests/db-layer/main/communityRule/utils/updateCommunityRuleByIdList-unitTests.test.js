const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("updateCommunityRuleByIdList module", () => {
  let sandbox;
  let updateCommunityRuleByIdList;
  let CommunityRuleStub;

  const fakeIdList = ["id1", "id2"];
  const fakeUpdatedRows = [
    { id: "id1", name: "Updated 1" },
    { id: "id2", name: "Updated 2" },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityRuleStub = {
      update: sandbox.stub().resolves([2, fakeUpdatedRows]),
    };

    updateCommunityRuleByIdList = proxyquire(
      "../../../../../src/db-layer/main/CommunityRule/utils/updateCommunityRuleByIdList",
      {
        models: { CommunityRule: CommunityRuleStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(message, details) {
              super(message);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
          hexaLogger: { insertError: sandbox.stub() },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("updateCommunityRuleByIdList", () => {
    it("should return list of updated IDs if update is successful", async () => {
      const result = await updateCommunityRuleByIdList(fakeIdList, {
        name: "Updated",
      });

      expect(result).to.deep.equal(["id1", "id2"]);
      sinon.assert.calledOnce(CommunityRuleStub.update);
      const args = CommunityRuleStub.update.getCall(0).args;
      expect(args[0]).to.deep.equal({ name: "Updated" });
      expect(args[1]).to.deep.equal({
        where: { id: { [Op.in]: fakeIdList }, isActive: true },
        returning: true,
      });
    });

    it("should return empty list if update returns no rows", async () => {
      CommunityRuleStub.update.resolves([0, []]);

      const result = await updateCommunityRuleByIdList(["id99"], {
        status: "inactive",
      });

      expect(result).to.deep.equal([]);
    });

    it("should return list with one id if only one record updated", async () => {
      CommunityRuleStub.update.resolves([1, [{ id: "id1" }]]);

      const result = await updateCommunityRuleByIdList(["id1"], {
        active: false,
      });

      expect(result).to.deep.equal(["id1"]);
    });

    it("should throw HttpServerError if model update fails", async () => {
      CommunityRuleStub.update.rejects(new Error("update failed"));

      try {
        await updateCommunityRuleByIdList(["id1"], { name: "err" });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenUpdatingCommunityRuleByIdList",
        );
        expect(err.details.message).to.equal("update failed");
      }
    });

    it("should call update with empty dataClause", async () => {
      await updateCommunityRuleByIdList(["id1"], {});
      sinon.assert.calledOnce(CommunityRuleStub.update);
    });
  });
});
