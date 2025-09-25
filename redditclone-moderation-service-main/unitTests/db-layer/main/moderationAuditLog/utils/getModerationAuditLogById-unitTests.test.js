const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getModerationAuditLogById module", () => {
  let sandbox;
  let getModerationAuditLogById;
  let ModerationAuditLogStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test ModerationAuditLog" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationAuditLogStub = {
      findOne: sandbox.stub().resolves({
        getData: () => fakeData,
      }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
    };

    getModerationAuditLogById = proxyquire(
      "../../../../../src/db-layer/main/ModerationAuditLog/utils/getModerationAuditLogById",
      {
        models: { ModerationAuditLog: ModerationAuditLogStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(msg, details) {
              super(msg);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getModerationAuditLogById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getModerationAuditLogById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(ModerationAuditLogStub.findOne);
      sinon.assert.calledWith(
        ModerationAuditLogStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getModerationAuditLogById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(ModerationAuditLogStub.findAll);
      sinon.assert.calledWithMatch(ModerationAuditLogStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      ModerationAuditLogStub.findOne.resolves(null);
      const result = await getModerationAuditLogById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      ModerationAuditLogStub.findAll.resolves([]);
      const result = await getModerationAuditLogById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      ModerationAuditLogStub.findOne.rejects(new Error("DB failure"));
      try {
        await getModerationAuditLogById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModerationAuditLogById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      ModerationAuditLogStub.findAll.rejects(new Error("array failure"));
      try {
        await getModerationAuditLogById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModerationAuditLogById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      ModerationAuditLogStub.findOne.resolves({ getData: () => undefined });
      const result = await getModerationAuditLogById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      ModerationAuditLogStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getModerationAuditLogById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
