const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteModmailthreadCommand is exported from main code

describe("DbDeleteModmailthreadCommand", () => {
  let DbDeleteModmailthreadCommand, dbDeleteModmailthread;
  let sandbox,
    ModmailThreadStub,
    getModmailThreadByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModmailThreadStub = {};

    getModmailThreadByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.modmailThreadId || 123 };
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

    ({ DbDeleteModmailthreadCommand, dbDeleteModmailthread } = proxyquire(
      "../../../../src/db-layer/main/modmailThread/dbDeleteModmailthread",
      {
        models: { ModmailThread: ModmailThreadStub },
        "./query-cache-classes": {
          ModmailThreadQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getModmailThreadById": getModmailThreadByIdStub,
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
      const cmd = new DbDeleteModmailthreadCommand({});
      expect(cmd.commandName).to.equal("dbDeleteModmailthread");
      expect(cmd.objectName).to.equal("modmailThread");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-moderation-service-dbevent-modmailthread-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteModmailthreadCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteModmailthread", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getModmailThreadByIdStub.resolves(mockInstance);

      const input = {
        modmailThreadId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteModmailthread(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
