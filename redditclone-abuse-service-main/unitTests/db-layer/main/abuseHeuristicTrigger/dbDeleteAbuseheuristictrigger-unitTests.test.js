const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteAbuseheuristictriggerCommand is exported from main code

describe("DbDeleteAbuseheuristictriggerCommand", () => {
  let DbDeleteAbuseheuristictriggerCommand, dbDeleteAbuseheuristictrigger;
  let sandbox,
    AbuseHeuristicTriggerStub,
    getAbuseHeuristicTriggerByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseHeuristicTriggerStub = {};

    getAbuseHeuristicTriggerByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.abuseHeuristicTriggerId || 123 };
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

    ({ DbDeleteAbuseheuristictriggerCommand, dbDeleteAbuseheuristictrigger } =
      proxyquire(
        "../../../../src/db-layer/main/abuseHeuristicTrigger/dbDeleteAbuseheuristictrigger",
        {
          models: { AbuseHeuristicTrigger: AbuseHeuristicTriggerStub },
          "./query-cache-classes": {
            AbuseHeuristicTriggerQueryCacheInvalidator: sandbox.stub(),
          },
          "./utils/getAbuseHeuristicTriggerById":
            getAbuseHeuristicTriggerByIdStub,
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
      const cmd = new DbDeleteAbuseheuristictriggerCommand({});
      expect(cmd.commandName).to.equal("dbDeleteAbuseheuristictrigger");
      expect(cmd.objectName).to.equal("abuseHeuristicTrigger");
      expect(cmd.serviceLabel).to.equal("redditclone-abuse-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-abuse-service-dbevent-abuseheuristictrigger-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteAbuseheuristictriggerCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteAbuseheuristictrigger", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getAbuseHeuristicTriggerByIdStub.resolves(mockInstance);

      const input = {
        abuseHeuristicTriggerId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteAbuseheuristictrigger(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
