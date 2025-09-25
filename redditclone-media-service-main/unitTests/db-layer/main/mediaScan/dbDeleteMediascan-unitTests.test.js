const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteMediascanCommand is exported from main code

describe("DbDeleteMediascanCommand", () => {
  let DbDeleteMediascanCommand, dbDeleteMediascan;
  let sandbox,
    MediaScanStub,
    getMediaScanByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaScanStub = {};

    getMediaScanByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.mediaScanId || 123 };
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

    ({ DbDeleteMediascanCommand, dbDeleteMediascan } = proxyquire(
      "../../../../src/db-layer/main/mediaScan/dbDeleteMediascan",
      {
        models: { MediaScan: MediaScanStub },
        "./query-cache-classes": {
          MediaScanQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getMediaScanById": getMediaScanByIdStub,
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
      const cmd = new DbDeleteMediascanCommand({});
      expect(cmd.commandName).to.equal("dbDeleteMediascan");
      expect(cmd.objectName).to.equal("mediaScan");
      expect(cmd.serviceLabel).to.equal("redditclone-media-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-media-service-dbevent-mediascan-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteMediascanCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteMediascan", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getMediaScanByIdStub.resolves(mockInstance);

      const input = {
        mediaScanId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteMediascan(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
