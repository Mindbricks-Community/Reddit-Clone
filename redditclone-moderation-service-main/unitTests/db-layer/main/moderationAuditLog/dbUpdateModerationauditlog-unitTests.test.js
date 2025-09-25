const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbUpdateModerationauditlogCommand is exported from main code

describe("DbUpdateModerationauditlogCommand", () => {
  let DbUpdateModerationauditlogCommand, dbUpdateModerationauditlog;
  let sandbox,
    getModerationAuditLogByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    getModerationAuditLogByIdStub = sandbox
      .stub()
      .resolves({ id: 99, name: "Updated moderationAuditLog" });

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dbData = { id: input.id || 99 };
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
      async execute() {
        await this.createQueryCacheInvalidator?.();
        await this.createDbInstance?.();
        await this.indexDataToElastic?.();
        return this.dbData;
      }
    };

    ({ DbUpdateModerationauditlogCommand, dbUpdateModerationauditlog } =
      proxyquire(
        "../../../../src/db-layer/main/moderationAuditLog/dbUpdateModerationauditlog",
        {
          "./utils/getModerationAuditLogById": getModerationAuditLogByIdStub,
          "./query-cache-classes": {
            ModerationAuditLogQueryCacheInvalidator: sandbox.stub(),
          },
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          dbCommand: {
            DBUpdateSequelizeCommand: BaseCommandStub,
          },
          common: {
            NotFoundError: class NotFoundError extends Error {
              constructor(msg) {
                super(msg);
                this.name = "NotFoundError";
              }
            },
          },
          models: {
            User: {},
          },
        },
      ));
  });

  afterEach(() => sandbox.restore());

  describe("constructor", () => {
    it("should set command metadata correctly", () => {
      const cmd = new DbUpdateModerationauditlogCommand({
        ModerationAuditLogId: 1,
      });
      expect(cmd.commandName).to.equal("dbUpdateModerationauditlog");
      expect(cmd.objectName).to.equal("moderationAuditLog");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.isBulk).to.be.false;
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with dbData.id", async () => {
      const cmd = new DbUpdateModerationauditlogCommand({
        session: "s",
        requestId: "r",
      });

      cmd.dbData = { id: 101 };
      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getModerationAuditLogByIdStub, 101);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().indexData, {
        id: 99,
        name: "Updated moderationAuditLog",
      });
    });
  });

  describe("buildIncludes", () => {
    it("should return [] includes", () => {
      const cmd = new DbUpdateModerationauditlogCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });
    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbUpdateModerationauditlogCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbUpdateModerationauditlog", () => {
    it("should execute update successfully", async () => {
      const result = await dbUpdateModerationauditlog({
        moderationAuditLogId: 99,
        session: "abc",
        requestId: "xyz",
      });

      expect(result).to.deep.equal({ id: 99 });
    });
  });
});
