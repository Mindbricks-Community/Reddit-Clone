const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("updateAbuseFlagByIdList module", () => {
  let sandbox;
  let updateAbuseFlagByIdList;
  let AbuseFlagStub;

  const fakeIdList = ["id1", "id2"];
  const fakeUpdatedRows = [
    { id: "id1", name: "Updated 1" },
    { id: "id2", name: "Updated 2" },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseFlagStub = {
      update: sandbox.stub().resolves([2, fakeUpdatedRows]),
    };

    updateAbuseFlagByIdList = proxyquire(
      "../../../../../src/db-layer/main/AbuseFlag/utils/updateAbuseFlagByIdList",
      {
        models: { AbuseFlag: AbuseFlagStub },
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

  describe("updateAbuseFlagByIdList", () => {
    it("should return list of updated IDs if update is successful", async () => {
      const result = await updateAbuseFlagByIdList(fakeIdList, {
        name: "Updated",
      });

      expect(result).to.deep.equal(["id1", "id2"]);
      sinon.assert.calledOnce(AbuseFlagStub.update);
      const args = AbuseFlagStub.update.getCall(0).args;
      expect(args[0]).to.deep.equal({ name: "Updated" });
      expect(args[1]).to.deep.equal({
        where: { id: { [Op.in]: fakeIdList }, isActive: true },
        returning: true,
      });
    });

    it("should return empty list if update returns no rows", async () => {
      AbuseFlagStub.update.resolves([0, []]);

      const result = await updateAbuseFlagByIdList(["id99"], {
        status: "inactive",
      });

      expect(result).to.deep.equal([]);
    });

    it("should return list with one id if only one record updated", async () => {
      AbuseFlagStub.update.resolves([1, [{ id: "id1" }]]);

      const result = await updateAbuseFlagByIdList(["id1"], { active: false });

      expect(result).to.deep.equal(["id1"]);
    });

    it("should throw HttpServerError if model update fails", async () => {
      AbuseFlagStub.update.rejects(new Error("update failed"));

      try {
        await updateAbuseFlagByIdList(["id1"], { name: "err" });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenUpdatingAbuseFlagByIdList",
        );
        expect(err.details.message).to.equal("update failed");
      }
    });

    it("should call update with empty dataClause", async () => {
      await updateAbuseFlagByIdList(["id1"], {});
      sinon.assert.calledOnce(AbuseFlagStub.update);
    });
  });
});
