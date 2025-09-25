const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteGlobaluserrestrictionCommand is exported from main code

describe("DbDeleteGlobaluserrestrictionCommand", () => {
  let DbDeleteGlobaluserrestrictionCommand, dbDeleteGlobaluserrestriction;
  let sandbox,
    GlobalUserRestrictionStub,
    getGlobalUserRestrictionByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GlobalUserRestrictionStub = {};

    getGlobalUserRestrictionByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.globalUserRestrictionId || 123 };
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

    ({ DbDeleteGlobaluserrestrictionCommand, dbDeleteGlobaluserrestriction } =
      proxyquire(
        "../../../../src/db-layer/main/globalUserRestriction/dbDeleteGlobaluserrestriction",
        {
          models: { GlobalUserRestriction: GlobalUserRestrictionStub },
          "./query-cache-classes": {
            GlobalUserRestrictionQueryCacheInvalidator: sandbox.stub(),
          },
          "./utils/getGlobalUserRestrictionById":
            getGlobalUserRestrictionByIdStub,
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
      const cmd = new DbDeleteGlobaluserrestrictionCommand({});
      expect(cmd.commandName).to.equal("dbDeleteGlobaluserrestriction");
      expect(cmd.objectName).to.equal("globalUserRestriction");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-adminops-service-dbevent-globaluserrestriction-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteGlobaluserrestrictionCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteGlobaluserrestriction", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getGlobalUserRestrictionByIdStub.resolves(mockInstance);

      const input = {
        globalUserRestrictionId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteGlobaluserrestriction(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
