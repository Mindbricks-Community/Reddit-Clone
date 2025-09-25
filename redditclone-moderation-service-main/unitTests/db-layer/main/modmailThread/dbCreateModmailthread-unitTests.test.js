const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateModmailthreadCommand is exported from main code
describe("DbCreateModmailthreadCommand", () => {
  let DbCreateModmailthreadCommand, dbCreateModmailthread;
  let sandbox,
    ModmailThreadStub,
    ElasticIndexerStub,
    getModmailThreadByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModmailThreadStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getModmailThreadByIdStub = sandbox
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

    ({ DbCreateModmailthreadCommand, dbCreateModmailthread } = proxyquire(
      "../../../../src/db-layer/main/modmailThread/dbCreateModmailthread",
      {
        models: { ModmailThread: ModmailThreadStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getModmailThreadById": getModmailThreadByIdStub,
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
      const cmd = new DbCreateModmailthreadCommand({});
      expect(cmd.commandName).to.equal("dbCreateModmailthread");
      expect(cmd.objectName).to.equal("modmailThread");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-moderation-service-dbevent-modmailthread-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getModmailThreadById and indexData", async () => {
      const cmd = new DbCreateModmailthreadCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getModmailThreadByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing modmailThread if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockmodmailThread = { update: updateStub, getData: () => ({ id: 2 }) };

      ModmailThreadStub.findOne = sandbox.stub().resolves(mockmodmailThread);
      ModmailThreadStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateModmailthreadCommand(input);
      await cmd.runDbCommand();

      expect(input.modmailThread).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new modmailThread if no unique match is found", async () => {
      ModmailThreadStub.findOne = sandbox.stub().resolves(null);
      ModmailThreadStub.findByPk = sandbox.stub().resolves(null);
      ModmailThreadStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateModmailthreadCommand(input);
      await cmd.runDbCommand();

      expect(input.modmailThread).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(ModmailThreadStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      ModmailThreadStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateModmailthreadCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateModmailthread", () => {
    it("should execute successfully and return dbData", async () => {
      ModmailThreadStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "modmailThread" } };
      const result = await dbCreateModmailthread(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
