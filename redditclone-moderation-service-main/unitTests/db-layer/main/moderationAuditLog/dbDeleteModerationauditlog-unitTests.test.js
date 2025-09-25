const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteModerationauditlogCommand is exported from main code

describe("DbDeleteModerationauditlogCommand", () => {
  let DbDeleteModerationauditlogCommand, dbDeleteModerationauditlog;
  let sandbox,
    ModerationAuditLogStub,
    getModerationAuditLogByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationAuditLogStub = {};

    getModerationAuditLogByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.moderationAuditLogId || 123 };
        this.dbInstance = null;
      }

      loadHookFunctions() {}
      initOwnership() {}
      async execute() {
        await this.createQueryCacheInvalidator?.();
        await this.createDbInstance?.();
        await this.indexDataToElastic?.();
        return this.dbData;
      }
    };

    ({ DbDeleteModerationauditlogCommand, dbDeleteModerationauditlog } =
      proxyquire(
        "../../../../src/db-layer/main/moderationAuditLog/dbDeleteModerationauditlog",
        {
          models: { ModerationAuditLog: ModerationAuditLogStub },
          "./query-cache-classes": {
            ModerationAuditLogQueryCacheInvalidator: sandbox.stub(),
          },
          "./utils/getModerationAuditLogById": getModerationAuditLogByIdStub,
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          dbCommand: {
            DBSoftDeleteSequelizeCommand: BaseCommandStub,
          },
          common: {
            NotFoundError: class NotFoundError extends Error {
              constructor(msg) {
                super(msg);
                this.name = "NotFoundError";
              }
            },
            HttpServerError: class extends Error {
              constructor(msg, details) {
                super(msg);
                this.details = details;
              }
            },
          },
        },
      ));
  });

  afterEach(() => sandbox.restore());

  describe("constructor", () => {
    it("should set command metadata correctly", () => {
      const cmd = new DbDeleteModerationauditlogCommand({});
      expect(cmd.commandName).to.equal("dbDeleteModerationauditlog");
      expect(cmd.objectName).to.equal("moderationAuditLog");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-moderation-service-dbevent-moderationauditlog-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteModerationauditlogCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteModerationauditlog", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getModerationAuditLogByIdStub.resolves(mockInstance);

      const input = {
        moderationAuditLogId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteModerationauditlog(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
