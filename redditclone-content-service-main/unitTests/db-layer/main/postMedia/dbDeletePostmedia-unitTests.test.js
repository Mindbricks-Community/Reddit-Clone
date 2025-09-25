const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeletePostmediaCommand is exported from main code

describe("DbDeletePostmediaCommand", () => {
  let DbDeletePostmediaCommand, dbDeletePostmedia;
  let sandbox,
    PostMediaStub,
    getPostMediaByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PostMediaStub = {};

    getPostMediaByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.postMediaId || 123 };
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

    ({ DbDeletePostmediaCommand, dbDeletePostmedia } = proxyquire(
      "../../../../src/db-layer/main/postMedia/dbDeletePostmedia",
      {
        models: { PostMedia: PostMediaStub },
        "./query-cache-classes": {
          PostMediaQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getPostMediaById": getPostMediaByIdStub,
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
      const cmd = new DbDeletePostmediaCommand({});
      expect(cmd.commandName).to.equal("dbDeletePostmedia");
      expect(cmd.objectName).to.equal("postMedia");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-content-service-dbevent-postmedia-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeletePostmediaCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeletePostmedia", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getPostMediaByIdStub.resolves(mockInstance);

      const input = {
        postMediaId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeletePostmedia(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
