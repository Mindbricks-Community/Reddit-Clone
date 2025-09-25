const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeletePolloptionCommand is exported from main code

describe("DbDeletePolloptionCommand", () => {
  let DbDeletePolloptionCommand, dbDeletePolloption;
  let sandbox,
    PollOptionStub,
    getPollOptionByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PollOptionStub = {};

    getPollOptionByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.pollOptionId || 123 };
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

    ({ DbDeletePolloptionCommand, dbDeletePolloption } = proxyquire(
      "../../../../src/db-layer/main/pollOption/dbDeletePolloption",
      {
        models: { PollOption: PollOptionStub },
        "./query-cache-classes": {
          PollOptionQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getPollOptionById": getPollOptionByIdStub,
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
      const cmd = new DbDeletePolloptionCommand({});
      expect(cmd.commandName).to.equal("dbDeletePolloption");
      expect(cmd.objectName).to.equal("pollOption");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-content-service-dbevent-polloption-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeletePolloptionCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeletePolloption", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getPollOptionByIdStub.resolves(mockInstance);

      const input = {
        pollOptionId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeletePolloption(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
