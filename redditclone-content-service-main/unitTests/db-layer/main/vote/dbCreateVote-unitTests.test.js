const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateVoteCommand is exported from main code
describe("DbCreateVoteCommand", () => {
  let DbCreateVoteCommand, dbCreateVote;
  let sandbox, VoteStub, ElasticIndexerStub, getVoteByIdStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    VoteStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getVoteByIdStub = sandbox.stub().resolves({ id: 1, name: "Mock Client" });

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

    ({ DbCreateVoteCommand, dbCreateVote } = proxyquire(
      "../../../../src/db-layer/main/vote/dbCreateVote",
      {
        models: { Vote: VoteStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getVoteById": getVoteByIdStub,
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
      const cmd = new DbCreateVoteCommand({});
      expect(cmd.commandName).to.equal("dbCreateVote");
      expect(cmd.objectName).to.equal("vote");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-content-service-dbevent-vote-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getVoteById and indexData", async () => {
      const cmd = new DbCreateVoteCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getVoteByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing vote if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockvote = { update: updateStub, getData: () => ({ id: 2 }) };

      VoteStub.findOne = sandbox.stub().resolves(mockvote);
      VoteStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          userId: "userId_value",
          
          postId: "postId_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateVoteCommand(input);
      await cmd.runDbCommand();

      expect(input.vote).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new vote if no unique match is found", async () => {
      VoteStub.findOne = sandbox.stub().resolves(null);
      VoteStub.findByPk = sandbox.stub().resolves(null);
      VoteStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          userId: "userId_value",
          
          postId: "postId_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateVoteCommand(input);
      await cmd.runDbCommand();

      expect(input.vote).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(VoteStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      VoteStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateVoteCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateVote", () => {
    it("should execute successfully and return dbData", async () => {
      VoteStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "vote" } };
      const result = await dbCreateVote(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
