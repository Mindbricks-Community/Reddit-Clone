const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteAbusereportCommand is exported from main code

describe("DbDeleteAbusereportCommand", () => {
  let DbDeleteAbusereportCommand, dbDeleteAbusereport;
  let sandbox,
    AbuseReportStub,
    getAbuseReportByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseReportStub = {};

    getAbuseReportByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.abuseReportId || 123 };
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

    ({ DbDeleteAbusereportCommand, dbDeleteAbusereport } = proxyquire(
      "../../../../src/db-layer/main/abuseReport/dbDeleteAbusereport",
      {
        models: { AbuseReport: AbuseReportStub },
        "./query-cache-classes": {
          AbuseReportQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getAbuseReportById": getAbuseReportByIdStub,
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
      const cmd = new DbDeleteAbusereportCommand({});
      expect(cmd.commandName).to.equal("dbDeleteAbusereport");
      expect(cmd.objectName).to.equal("abuseReport");
      expect(cmd.serviceLabel).to.equal("redditclone-abuse-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-abuse-service-dbevent-abusereport-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteAbusereportCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteAbusereport", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getAbuseReportByIdStub.resolves(mockInstance);

      const input = {
        abuseReportId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteAbusereport(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
