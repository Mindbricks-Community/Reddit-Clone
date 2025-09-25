const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteAbuseflagCommand is exported from main code

describe("DbDeleteAbuseflagCommand", () => {
  let DbDeleteAbuseflagCommand, dbDeleteAbuseflag;
  let sandbox,
    AbuseFlagStub,
    getAbuseFlagByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseFlagStub = {};

    getAbuseFlagByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.abuseFlagId || 123 };
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

    ({ DbDeleteAbuseflagCommand, dbDeleteAbuseflag } = proxyquire(
      "../../../../src/db-layer/main/abuseFlag/dbDeleteAbuseflag",
      {
        models: { AbuseFlag: AbuseFlagStub },
        "./query-cache-classes": {
          AbuseFlagQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getAbuseFlagById": getAbuseFlagByIdStub,
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
      const cmd = new DbDeleteAbuseflagCommand({});
      expect(cmd.commandName).to.equal("dbDeleteAbuseflag");
      expect(cmd.objectName).to.equal("abuseFlag");
      expect(cmd.serviceLabel).to.equal("redditclone-abuse-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-abuse-service-dbevent-abuseflag-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteAbuseflagCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteAbuseflag", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getAbuseFlagByIdStub.resolves(mockInstance);

      const input = {
        abuseFlagId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteAbuseflag(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
