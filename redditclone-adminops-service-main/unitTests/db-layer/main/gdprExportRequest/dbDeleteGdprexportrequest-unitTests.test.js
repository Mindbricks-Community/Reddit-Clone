const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteGdprexportrequestCommand is exported from main code

describe("DbDeleteGdprexportrequestCommand", () => {
  let DbDeleteGdprexportrequestCommand, dbDeleteGdprexportrequest;
  let sandbox,
    GdprExportRequestStub,
    getGdprExportRequestByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprExportRequestStub = {};

    getGdprExportRequestByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.gdprExportRequestId || 123 };
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

    ({ DbDeleteGdprexportrequestCommand, dbDeleteGdprexportrequest } =
      proxyquire(
        "../../../../src/db-layer/main/gdprExportRequest/dbDeleteGdprexportrequest",
        {
          models: { GdprExportRequest: GdprExportRequestStub },
          "./query-cache-classes": {
            GdprExportRequestQueryCacheInvalidator: sandbox.stub(),
          },
          "./utils/getGdprExportRequestById": getGdprExportRequestByIdStub,
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
      const cmd = new DbDeleteGdprexportrequestCommand({});
      expect(cmd.commandName).to.equal("dbDeleteGdprexportrequest");
      expect(cmd.objectName).to.equal("gdprExportRequest");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-adminops-service-dbevent-gdprexportrequest-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteGdprexportrequestCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteGdprexportrequest", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getGdprExportRequestByIdStub.resolves(mockInstance);

      const input = {
        gdprExportRequestId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteGdprexportrequest(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
