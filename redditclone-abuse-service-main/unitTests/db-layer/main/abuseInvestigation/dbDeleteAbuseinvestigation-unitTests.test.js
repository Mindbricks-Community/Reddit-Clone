const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteAbuseinvestigationCommand is exported from main code

describe("DbDeleteAbuseinvestigationCommand", () => {
  let DbDeleteAbuseinvestigationCommand, dbDeleteAbuseinvestigation;
  let sandbox,
    AbuseInvestigationStub,
    getAbuseInvestigationByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseInvestigationStub = {};

    getAbuseInvestigationByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.abuseInvestigationId || 123 };
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

    ({ DbDeleteAbuseinvestigationCommand, dbDeleteAbuseinvestigation } =
      proxyquire(
        "../../../../src/db-layer/main/abuseInvestigation/dbDeleteAbuseinvestigation",
        {
          models: { AbuseInvestigation: AbuseInvestigationStub },
          "./query-cache-classes": {
            AbuseInvestigationQueryCacheInvalidator: sandbox.stub(),
          },
          "./utils/getAbuseInvestigationById": getAbuseInvestigationByIdStub,
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
      const cmd = new DbDeleteAbuseinvestigationCommand({});
      expect(cmd.commandName).to.equal("dbDeleteAbuseinvestigation");
      expect(cmd.objectName).to.equal("abuseInvestigation");
      expect(cmd.serviceLabel).to.equal("redditclone-abuse-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-abuse-service-dbevent-abuseinvestigation-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteAbuseinvestigationCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteAbuseinvestigation", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getAbuseInvestigationByIdStub.resolves(mockInstance);

      const input = {
        abuseInvestigationId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteAbuseinvestigation(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
