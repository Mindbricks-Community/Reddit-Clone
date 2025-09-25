const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreatePolloptionCommand is exported from main code
describe("DbCreatePolloptionCommand", () => {
  let DbCreatePolloptionCommand, dbCreatePolloption;
  let sandbox,
    PollOptionStub,
    ElasticIndexerStub,
    getPollOptionByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PollOptionStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getPollOptionByIdStub = sandbox
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

    ({ DbCreatePolloptionCommand, dbCreatePolloption } = proxyquire(
      "../../../../src/db-layer/main/pollOption/dbCreatePolloption",
      {
        models: { PollOption: PollOptionStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getPollOptionById": getPollOptionByIdStub,
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
      const cmd = new DbCreatePolloptionCommand({});
      expect(cmd.commandName).to.equal("dbCreatePolloption");
      expect(cmd.objectName).to.equal("pollOption");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-content-service-dbevent-polloption-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getPollOptionById and indexData", async () => {
      const cmd = new DbCreatePolloptionCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getPollOptionByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing pollOption if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockpollOption = { update: updateStub, getData: () => ({ id: 2 }) };

      PollOptionStub.findOne = sandbox.stub().resolves(mockpollOption);
      PollOptionStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          postId: "postId_value",
          
          optionIndex: "optionIndex_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreatePolloptionCommand(input);
      await cmd.runDbCommand();

      expect(input.pollOption).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new pollOption if no unique match is found", async () => {
      PollOptionStub.findOne = sandbox.stub().resolves(null);
      PollOptionStub.findByPk = sandbox.stub().resolves(null);
      PollOptionStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          postId: "postId_value",
          
          optionIndex: "optionIndex_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreatePolloptionCommand(input);
      await cmd.runDbCommand();

      expect(input.pollOption).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(PollOptionStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      PollOptionStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreatePolloptionCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreatePolloption", () => {
    it("should execute successfully and return dbData", async () => {
      PollOptionStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "pollOption" } };
      const result = await dbCreatePolloption(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
