const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteGdprdeleterequestCommand is exported from main code

describe("DbDeleteGdprdeleterequestCommand", () => {
  let DbDeleteGdprdeleterequestCommand, dbDeleteGdprdeleterequest;
  let sandbox,
    GdprDeleteRequestStub,
    getGdprDeleteRequestByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprDeleteRequestStub = {};

    getGdprDeleteRequestByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.gdprDeleteRequestId || 123 };
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

    ({ DbDeleteGdprdeleterequestCommand, dbDeleteGdprdeleterequest } =
      proxyquire(
        "../../../../src/db-layer/main/gdprDeleteRequest/dbDeleteGdprdeleterequest",
        {
          models: { GdprDeleteRequest: GdprDeleteRequestStub },
          "./query-cache-classes": {
            GdprDeleteRequestQueryCacheInvalidator: sandbox.stub(),
          },
          "./utils/getGdprDeleteRequestById": getGdprDeleteRequestByIdStub,
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
      const cmd = new DbDeleteGdprdeleterequestCommand({});
      expect(cmd.commandName).to.equal("dbDeleteGdprdeleterequest");
      expect(cmd.objectName).to.equal("gdprDeleteRequest");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-adminops-service-dbevent-gdprdeleterequest-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteGdprdeleterequestCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteGdprdeleterequest", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getGdprDeleteRequestByIdStub.resolves(mockInstance);

      const input = {
        gdprDeleteRequestId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteGdprdeleterequest(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
