const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteAutomodeventCommand is exported from main code

describe("DbDeleteAutomodeventCommand", () => {
  let DbDeleteAutomodeventCommand, dbDeleteAutomodevent;
  let sandbox,
    AutomodEventStub,
    getAutomodEventByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AutomodEventStub = {};

    getAutomodEventByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.automodEventId || 123 };
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

    ({ DbDeleteAutomodeventCommand, dbDeleteAutomodevent } = proxyquire(
      "../../../../src/db-layer/main/automodEvent/dbDeleteAutomodevent",
      {
        models: { AutomodEvent: AutomodEventStub },
        "./query-cache-classes": {
          AutomodEventQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getAutomodEventById": getAutomodEventByIdStub,
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
      const cmd = new DbDeleteAutomodeventCommand({});
      expect(cmd.commandName).to.equal("dbDeleteAutomodevent");
      expect(cmd.objectName).to.equal("automodEvent");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-moderation-service-dbevent-automodevent-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteAutomodeventCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteAutomodevent", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getAutomodEventByIdStub.resolves(mockInstance);

      const input = {
        automodEventId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteAutomodevent(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
