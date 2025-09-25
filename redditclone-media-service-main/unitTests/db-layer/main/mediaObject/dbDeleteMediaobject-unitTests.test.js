const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteMediaobjectCommand is exported from main code

describe("DbDeleteMediaobjectCommand", () => {
  let DbDeleteMediaobjectCommand, dbDeleteMediaobject;
  let sandbox,
    MediaObjectStub,
    getMediaObjectByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaObjectStub = {};

    getMediaObjectByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.mediaObjectId || 123 };
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

    ({ DbDeleteMediaobjectCommand, dbDeleteMediaobject } = proxyquire(
      "../../../../src/db-layer/main/mediaObject/dbDeleteMediaobject",
      {
        models: { MediaObject: MediaObjectStub },
        "./query-cache-classes": {
          MediaObjectQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getMediaObjectById": getMediaObjectByIdStub,
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
      const cmd = new DbDeleteMediaobjectCommand({});
      expect(cmd.commandName).to.equal("dbDeleteMediaobject");
      expect(cmd.objectName).to.equal("mediaObject");
      expect(cmd.serviceLabel).to.equal("redditclone-media-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-media-service-dbevent-mediaobject-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteMediaobjectCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteMediaobject", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getMediaObjectByIdStub.resolves(mockInstance);

      const input = {
        mediaObjectId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteMediaobject(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
