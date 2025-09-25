const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteLocaleCommand is exported from main code

describe("DbDeleteLocaleCommand", () => {
  let DbDeleteLocaleCommand, dbDeleteLocale;
  let sandbox,
    LocaleStub,
    getLocaleByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocaleStub = {};

    getLocaleByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.localeId || 123 };
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

    ({ DbDeleteLocaleCommand, dbDeleteLocale } = proxyquire(
      "../../../../src/db-layer/main/locale/dbDeleteLocale",
      {
        models: { Locale: LocaleStub },
        "./query-cache-classes": {
          LocaleQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getLocaleById": getLocaleByIdStub,
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
      const cmd = new DbDeleteLocaleCommand({});
      expect(cmd.commandName).to.equal("dbDeleteLocale");
      expect(cmd.objectName).to.equal("locale");
      expect(cmd.serviceLabel).to.equal("redditclone-localization-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-localization-service-dbevent-locale-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteLocaleCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteLocale", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getLocaleByIdStub.resolves(mockInstance);

      const input = {
        localeId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteLocale(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
