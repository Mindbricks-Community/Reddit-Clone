const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateModerationauditlogCommand is exported from main code
describe("DbCreateModerationauditlogCommand", () => {
  let DbCreateModerationauditlogCommand, dbCreateModerationauditlog;
  let sandbox,
    ModerationAuditLogStub,
    ElasticIndexerStub,
    getModerationAuditLogByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationAuditLogStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getModerationAuditLogByIdStub = sandbox
      .stub()
      .resolves({ id: 1, name: "Mock Client" });

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input) {
        this.input = input;
        this.dataClause = input.dataClause || {};
        this.session = input.session;
        this.requestId = input.requestId;
        this.dbData = { id: 9 };
      }

      async runDbCommand() {}
      async execute() {
        return this.dbData;
      }
      loadHookFunctions() {}
      createEntityCacher() {}
      normalizeSequalizeOps(w) {
        return w;
      }
      createQueryCacheInvalidator() {}
    };

    ({ DbCreateModerationauditlogCommand, dbCreateModerationauditlog } =
      proxyquire(
        "../../../../src/db-layer/main/moderationAuditLog/dbCreateModerationauditlog",
        {
          models: { ModerationAuditLog: ModerationAuditLogStub },
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          "./utils/getModerationAuditLogById": getModerationAuditLogByIdStub,
          dbCommand: { DBCreateSequelizeCommand: BaseCommandStub },
          "./query-cache-classes": {
            ClientQueryCacheInvalidator: sandbox.stub(),
          },
          common: {
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
    it("should assign initial properties", () => {
      const cmd = new DbCreateModerationauditlogCommand({});
      expect(cmd.commandName).to.equal("dbCreateModerationauditlog");
      expect(cmd.objectName).to.equal("moderationAuditLog");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-moderation-service-dbevent-moderationauditlog-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getModerationAuditLogById and indexData", async () => {
      const cmd = new DbCreateModerationauditlogCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getModerationAuditLogByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing moderationAuditLog if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockmoderationAuditLog = { update: updateStub, getData: () => ({ id: 2 }) };

      ModerationAuditLogStub.findOne = sandbox.stub().resolves(mockmoderationAuditLog);
      ModerationAuditLogStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateModerationauditlogCommand(input);
      await cmd.runDbCommand();

      expect(input.moderationAuditLog).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new moderationAuditLog if no unique match is found", async () => {
      ModerationAuditLogStub.findOne = sandbox.stub().resolves(null);
      ModerationAuditLogStub.findByPk = sandbox.stub().resolves(null);
      ModerationAuditLogStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateModerationauditlogCommand(input);
      await cmd.runDbCommand();

      expect(input.moderationAuditLog).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(ModerationAuditLogStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      ModerationAuditLogStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateModerationauditlogCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateModerationauditlog", () => {
    it("should execute successfully and return dbData", async () => {
      ModerationAuditLogStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "moderationAuditLog" } };
      const result = await dbCreateModerationauditlog(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
