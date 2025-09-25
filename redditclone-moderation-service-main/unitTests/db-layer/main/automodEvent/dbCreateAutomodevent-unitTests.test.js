const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateAutomodeventCommand is exported from main code
describe("DbCreateAutomodeventCommand", () => {
  let DbCreateAutomodeventCommand, dbCreateAutomodevent;
  let sandbox,
    AutomodEventStub,
    ElasticIndexerStub,
    getAutomodEventByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AutomodEventStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getAutomodEventByIdStub = sandbox
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

    ({ DbCreateAutomodeventCommand, dbCreateAutomodevent } = proxyquire(
      "../../../../src/db-layer/main/automodEvent/dbCreateAutomodevent",
      {
        models: { AutomodEvent: AutomodEventStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getAutomodEventById": getAutomodEventByIdStub,
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
      const cmd = new DbCreateAutomodeventCommand({});
      expect(cmd.commandName).to.equal("dbCreateAutomodevent");
      expect(cmd.objectName).to.equal("automodEvent");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-moderation-service-dbevent-automodevent-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getAutomodEventById and indexData", async () => {
      const cmd = new DbCreateAutomodeventCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getAutomodEventByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing automodEvent if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockautomodEvent = { update: updateStub, getData: () => ({ id: 2 }) };

      AutomodEventStub.findOne = sandbox.stub().resolves(mockautomodEvent);
      AutomodEventStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateAutomodeventCommand(input);
      await cmd.runDbCommand();

      expect(input.automodEvent).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new automodEvent if no unique match is found", async () => {
      AutomodEventStub.findOne = sandbox.stub().resolves(null);
      AutomodEventStub.findByPk = sandbox.stub().resolves(null);
      AutomodEventStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateAutomodeventCommand(input);
      await cmd.runDbCommand();

      expect(input.automodEvent).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(AutomodEventStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      AutomodEventStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateAutomodeventCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateAutomodevent", () => {
    it("should execute successfully and return dbData", async () => {
      AutomodEventStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "automodEvent" } };
      const result = await dbCreateAutomodevent(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
