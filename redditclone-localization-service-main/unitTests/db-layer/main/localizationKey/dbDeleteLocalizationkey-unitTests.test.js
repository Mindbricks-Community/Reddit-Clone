const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteLocalizationkeyCommand is exported from main code

describe("DbDeleteLocalizationkeyCommand", () => {
  let DbDeleteLocalizationkeyCommand, dbDeleteLocalizationkey;
  let sandbox,
    LocalizationKeyStub,
    getLocalizationKeyByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationKeyStub = {};

    getLocalizationKeyByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.localizationKeyId || 123 };
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

    ({ DbDeleteLocalizationkeyCommand, dbDeleteLocalizationkey } = proxyquire(
      "../../../../src/db-layer/main/localizationKey/dbDeleteLocalizationkey",
      {
        models: { LocalizationKey: LocalizationKeyStub },
        "./query-cache-classes": {
          LocalizationKeyQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getLocalizationKeyById": getLocalizationKeyByIdStub,
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
      const cmd = new DbDeleteLocalizationkeyCommand({});
      expect(cmd.commandName).to.equal("dbDeleteLocalizationkey");
      expect(cmd.objectName).to.equal("localizationKey");
      expect(cmd.serviceLabel).to.equal("redditclone-localization-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-localization-service-dbevent-localizationkey-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteLocalizationkeyCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteLocalizationkey", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getLocalizationKeyByIdStub.resolves(mockInstance);

      const input = {
        localizationKeyId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteLocalizationkey(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
