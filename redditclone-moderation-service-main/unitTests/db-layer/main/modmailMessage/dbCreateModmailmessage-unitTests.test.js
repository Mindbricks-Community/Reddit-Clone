const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateModmailmessageCommand is exported from main code
describe("DbCreateModmailmessageCommand", () => {
  let DbCreateModmailmessageCommand, dbCreateModmailmessage;
  let sandbox,
    ModmailMessageStub,
    ElasticIndexerStub,
    getModmailMessageByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModmailMessageStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getModmailMessageByIdStub = sandbox
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

    ({ DbCreateModmailmessageCommand, dbCreateModmailmessage } = proxyquire(
      "../../../../src/db-layer/main/modmailMessage/dbCreateModmailmessage",
      {
        models: { ModmailMessage: ModmailMessageStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getModmailMessageById": getModmailMessageByIdStub,
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
      const cmd = new DbCreateModmailmessageCommand({});
      expect(cmd.commandName).to.equal("dbCreateModmailmessage");
      expect(cmd.objectName).to.equal("modmailMessage");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-moderation-service-dbevent-modmailmessage-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getModmailMessageById and indexData", async () => {
      const cmd = new DbCreateModmailmessageCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getModmailMessageByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing modmailMessage if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockmodmailMessage = { update: updateStub, getData: () => ({ id: 2 }) };

      ModmailMessageStub.findOne = sandbox.stub().resolves(mockmodmailMessage);
      ModmailMessageStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateModmailmessageCommand(input);
      await cmd.runDbCommand();

      expect(input.modmailMessage).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new modmailMessage if no unique match is found", async () => {
      ModmailMessageStub.findOne = sandbox.stub().resolves(null);
      ModmailMessageStub.findByPk = sandbox.stub().resolves(null);
      ModmailMessageStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateModmailmessageCommand(input);
      await cmd.runDbCommand();

      expect(input.modmailMessage).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(ModmailMessageStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      ModmailMessageStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateModmailmessageCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateModmailmessage", () => {
    it("should execute successfully and return dbData", async () => {
      ModmailMessageStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "modmailMessage" } };
      const result = await dbCreateModmailmessage(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
