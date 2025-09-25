const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteCommunityautomodsettingCommand is exported from main code

describe("DbDeleteCommunityautomodsettingCommand", () => {
  let DbDeleteCommunityautomodsettingCommand, dbDeleteCommunityautomodsetting;
  let sandbox,
    CommunityAutomodSettingStub,
    getCommunityAutomodSettingByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityAutomodSettingStub = {};

    getCommunityAutomodSettingByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.communityAutomodSettingId || 123 };
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

    ({
      DbDeleteCommunityautomodsettingCommand,
      dbDeleteCommunityautomodsetting,
    } = proxyquire(
      "../../../../src/db-layer/main/communityAutomodSetting/dbDeleteCommunityautomodsetting",
      {
        models: { CommunityAutomodSetting: CommunityAutomodSettingStub },
        "./query-cache-classes": {
          CommunityAutomodSettingQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getCommunityAutomodSettingById":
          getCommunityAutomodSettingByIdStub,
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
      const cmd = new DbDeleteCommunityautomodsettingCommand({});
      expect(cmd.commandName).to.equal("dbDeleteCommunityautomodsetting");
      expect(cmd.objectName).to.equal("communityAutomodSetting");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-community-service-dbevent-communityautomodsetting-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteCommunityautomodsettingCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteCommunityautomodsetting", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getCommunityAutomodSettingByIdStub.resolves(mockInstance);

      const input = {
        communityAutomodSettingId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteCommunityautomodsetting(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
