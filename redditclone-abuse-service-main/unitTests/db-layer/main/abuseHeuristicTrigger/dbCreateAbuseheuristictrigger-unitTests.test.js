const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateAbuseheuristictriggerCommand is exported from main code
describe("DbCreateAbuseheuristictriggerCommand", () => {
  let DbCreateAbuseheuristictriggerCommand, dbCreateAbuseheuristictrigger;
  let sandbox,
    AbuseHeuristicTriggerStub,
    ElasticIndexerStub,
    getAbuseHeuristicTriggerByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseHeuristicTriggerStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getAbuseHeuristicTriggerByIdStub = sandbox
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

    ({ DbCreateAbuseheuristictriggerCommand, dbCreateAbuseheuristictrigger } =
      proxyquire(
        "../../../../src/db-layer/main/abuseHeuristicTrigger/dbCreateAbuseheuristictrigger",
        {
          models: { AbuseHeuristicTrigger: AbuseHeuristicTriggerStub },
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          "./utils/getAbuseHeuristicTriggerById":
            getAbuseHeuristicTriggerByIdStub,
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
      const cmd = new DbCreateAbuseheuristictriggerCommand({});
      expect(cmd.commandName).to.equal("dbCreateAbuseheuristictrigger");
      expect(cmd.objectName).to.equal("abuseHeuristicTrigger");
      expect(cmd.serviceLabel).to.equal("redditclone-abuse-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-abuse-service-dbevent-abuseheuristictrigger-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getAbuseHeuristicTriggerById and indexData", async () => {
      const cmd = new DbCreateAbuseheuristictriggerCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getAbuseHeuristicTriggerByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing abuseHeuristicTrigger if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockabuseHeuristicTrigger = { update: updateStub, getData: () => ({ id: 2 }) };

      AbuseHeuristicTriggerStub.findOne = sandbox.stub().resolves(mockabuseHeuristicTrigger);
      AbuseHeuristicTriggerStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          userId: "userId_value",
          
          ipAddress: "ipAddress_value",
          
          triggerType: "triggerType_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateAbuseheuristictriggerCommand(input);
      await cmd.runDbCommand();

      expect(input.abuseHeuristicTrigger).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new abuseHeuristicTrigger if no unique match is found", async () => {
      AbuseHeuristicTriggerStub.findOne = sandbox.stub().resolves(null);
      AbuseHeuristicTriggerStub.findByPk = sandbox.stub().resolves(null);
      AbuseHeuristicTriggerStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          userId: "userId_value",
          
          ipAddress: "ipAddress_value",
          
          triggerType: "triggerType_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateAbuseheuristictriggerCommand(input);
      await cmd.runDbCommand();

      expect(input.abuseHeuristicTrigger).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(AbuseHeuristicTriggerStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      AbuseHeuristicTriggerStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateAbuseheuristictriggerCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateAbuseheuristictrigger", () => {
    it("should execute successfully and return dbData", async () => {
      AbuseHeuristicTriggerStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "abuseHeuristicTrigger" } };
      const result = await dbCreateAbuseheuristictrigger(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
