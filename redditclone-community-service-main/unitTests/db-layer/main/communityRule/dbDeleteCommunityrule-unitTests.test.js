const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteCommunityruleCommand is exported from main code

describe("DbDeleteCommunityruleCommand", () => {
  let DbDeleteCommunityruleCommand, dbDeleteCommunityrule;
  let sandbox,
    CommunityRuleStub,
    getCommunityRuleByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityRuleStub = {};

    getCommunityRuleByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.communityRuleId || 123 };
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

    ({ DbDeleteCommunityruleCommand, dbDeleteCommunityrule } = proxyquire(
      "../../../../src/db-layer/main/communityRule/dbDeleteCommunityrule",
      {
        models: { CommunityRule: CommunityRuleStub },
        "./query-cache-classes": {
          CommunityRuleQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getCommunityRuleById": getCommunityRuleByIdStub,
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
      const cmd = new DbDeleteCommunityruleCommand({});
      expect(cmd.commandName).to.equal("dbDeleteCommunityrule");
      expect(cmd.objectName).to.equal("communityRule");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-community-service-dbevent-communityrule-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteCommunityruleCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteCommunityrule", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getCommunityRuleByIdStub.resolves(mockInstance);

      const input = {
        communityRuleId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteCommunityrule(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
