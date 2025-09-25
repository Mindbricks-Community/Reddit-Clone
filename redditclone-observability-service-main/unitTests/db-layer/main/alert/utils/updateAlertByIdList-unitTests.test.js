const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("updateAlertByIdList module", () => {
  let sandbox;
  let updateAlertByIdList;
  let AlertStub;

  const fakeIdList = ["id1", "id2"];
  const fakeUpdatedRows = [
    { id: "id1", name: "Updated 1" },
    { id: "id2", name: "Updated 2" },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AlertStub = {
      update: sandbox.stub().resolves([2, fakeUpdatedRows]),
    };

    updateAlertByIdList = proxyquire(
      "../../../../../src/db-layer/main/Alert/utils/updateAlertByIdList",
      {
        models: { Alert: AlertStub },
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

  describe("updateAlertByIdList", () => {
    it("should return list of updated IDs if update is successful", async () => {
      const result = await updateAlertByIdList(fakeIdList, { name: "Updated" });

      expect(result).to.deep.equal(["id1", "id2"]);
      sinon.assert.calledOnce(AlertStub.update);
      const args = AlertStub.update.getCall(0).args;
      expect(args[0]).to.deep.equal({ name: "Updated" });
      expect(args[1]).to.deep.equal({
        where: { id: { [Op.in]: fakeIdList }, isActive: true },
        returning: true,
      });
    });

    it("should return empty list if update returns no rows", async () => {
      AlertStub.update.resolves([0, []]);

      const result = await updateAlertByIdList(["id99"], {
        status: "inactive",
      });

      expect(result).to.deep.equal([]);
    });

    it("should return list with one id if only one record updated", async () => {
      AlertStub.update.resolves([1, [{ id: "id1" }]]);

      const result = await updateAlertByIdList(["id1"], { active: false });

      expect(result).to.deep.equal(["id1"]);
    });

    it("should throw HttpServerError if model update fails", async () => {
      AlertStub.update.rejects(new Error("update failed"));

      try {
        await updateAlertByIdList(["id1"], { name: "err" });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenUpdatingAlertByIdList");
        expect(err.details.message).to.equal("update failed");
      }
    });

    it("should call update with empty dataClause", async () => {
      await updateAlertByIdList(["id1"], {});
      sinon.assert.calledOnce(AlertStub.update);
    });
  });
});
