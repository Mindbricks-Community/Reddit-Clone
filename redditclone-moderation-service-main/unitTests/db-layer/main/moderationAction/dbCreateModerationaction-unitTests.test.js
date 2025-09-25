const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateModerationactionCommand is exported from main code
describe("DbCreateModerationactionCommand", () => {
  let DbCreateModerationactionCommand, dbCreateModerationaction;
  let sandbox,
    ModerationActionStub,
    ElasticIndexerStub,
    getModerationActionByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationActionStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getModerationActionByIdStub = sandbox
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

    ({ DbCreateModerationactionCommand, dbCreateModerationaction } = proxyquire(
      "../../../../src/db-layer/main/moderationAction/dbCreateModerationaction",
      {
        models: { ModerationAction: ModerationActionStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getModerationActionById": getModerationActionByIdStub,
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
      const cmd = new DbCreateModerationactionCommand({});
      expect(cmd.commandName).to.equal("dbCreateModerationaction");
      expect(cmd.objectName).to.equal("moderationAction");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-moderation-service-dbevent-moderationaction-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getModerationActionById and indexData", async () => {
      const cmd = new DbCreateModerationactionCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getModerationActionByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing moderationAction if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockmoderationAction = { update: updateStub, getData: () => ({ id: 2 }) };

      ModerationActionStub.findOne = sandbox.stub().resolves(mockmoderationAction);
      ModerationActionStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateModerationactionCommand(input);
      await cmd.runDbCommand();

      expect(input.moderationAction).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new moderationAction if no unique match is found", async () => {
      ModerationActionStub.findOne = sandbox.stub().resolves(null);
      ModerationActionStub.findByPk = sandbox.stub().resolves(null);
      ModerationActionStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateModerationactionCommand(input);
      await cmd.runDbCommand();

      expect(input.moderationAction).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(ModerationActionStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      ModerationActionStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateModerationactionCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateModerationaction", () => {
    it("should execute successfully and return dbData", async () => {
      ModerationActionStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "moderationAction" } };
      const result = await dbCreateModerationaction(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
