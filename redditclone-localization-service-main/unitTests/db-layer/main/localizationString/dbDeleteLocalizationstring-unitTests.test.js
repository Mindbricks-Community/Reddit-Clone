const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteLocalizationstringCommand is exported from main code

describe("DbDeleteLocalizationstringCommand", () => {
  let DbDeleteLocalizationstringCommand, dbDeleteLocalizationstring;
  let sandbox,
    LocalizationStringStub,
    getLocalizationStringByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationStringStub = {};

    getLocalizationStringByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.localizationStringId || 123 };
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

    ({ DbDeleteLocalizationstringCommand, dbDeleteLocalizationstring } =
      proxyquire(
        "../../../../src/db-layer/main/localizationString/dbDeleteLocalizationstring",
        {
          models: { LocalizationString: LocalizationStringStub },
          "./query-cache-classes": {
            LocalizationStringQueryCacheInvalidator: sandbox.stub(),
          },
          "./utils/getLocalizationStringById": getLocalizationStringByIdStub,
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
      const cmd = new DbDeleteLocalizationstringCommand({});
      expect(cmd.commandName).to.equal("dbDeleteLocalizationstring");
      expect(cmd.objectName).to.equal("localizationString");
      expect(cmd.serviceLabel).to.equal("redditclone-localization-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-localization-service-dbevent-localizationstring-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteLocalizationstringCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteLocalizationstring", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getLocalizationStringByIdStub.resolves(mockInstance);

      const input = {
        localizationStringId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteLocalizationstring(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
