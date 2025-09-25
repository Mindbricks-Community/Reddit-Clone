const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteVoteCommand is exported from main code

describe("DbDeleteVoteCommand", () => {
  let DbDeleteVoteCommand, dbDeleteVote;
  let sandbox, VoteStub, getVoteByIdStub, ElasticIndexerStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    VoteStub = {};

    getVoteByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.voteId || 123 };
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

    ({ DbDeleteVoteCommand, dbDeleteVote } = proxyquire(
      "../../../../src/db-layer/main/vote/dbDeleteVote",
      {
        models: { Vote: VoteStub },
        "./query-cache-classes": {
          VoteQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getVoteById": getVoteByIdStub,
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
      const cmd = new DbDeleteVoteCommand({});
      expect(cmd.commandName).to.equal("dbDeleteVote");
      expect(cmd.objectName).to.equal("vote");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-content-service-dbevent-vote-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteVoteCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteVote", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getVoteByIdStub.resolves(mockInstance);

      const input = {
        voteId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteVote(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
