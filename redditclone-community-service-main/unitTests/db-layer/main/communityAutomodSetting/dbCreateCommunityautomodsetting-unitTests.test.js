const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateCommunityautomodsettingCommand is exported from main code
describe("DbCreateCommunityautomodsettingCommand", () => {
  let DbCreateCommunityautomodsettingCommand, dbCreateCommunityautomodsetting;
  let sandbox,
    CommunityAutomodSettingStub,
    ElasticIndexerStub,
    getCommunityAutomodSettingByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityAutomodSettingStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getCommunityAutomodSettingByIdStub = sandbox
      .stub()
      .resolves({ id: 1, name: "Mock Client" });

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input) {
        this.input = input;
        this.dataClause = input.dataClause || {};
        this.session = input.session;
        this.requestId = input.requestId;
        this.dbData = { id: 9 };
      }

      async runDbCommand() {}
      async execute() {
        return this.dbData;
      }
      loadHookFunctions() {}
      createEntityCacher() {}
      normalizeSequalizeOps(w) {
        return w;
      }
      createQueryCacheInvalidator() {}
    };

    ({
      DbCreateCommunityautomodsettingCommand,
      dbCreateCommunityautomodsetting,
    } = proxyquire(
      "../../../../src/db-layer/main/communityAutomodSetting/dbCreateCommunityautomodsetting",
      {
        models: { CommunityAutomodSetting: CommunityAutomodSettingStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getCommunityAutomodSettingById":
          getCommunityAutomodSettingByIdStub,
        dbCommand: { DBCreateSequelizeCommand: BaseCommandStub },
        "./query-cache-classes": {
          ClientQueryCacheInvalidator: sandbox.stub(),
        },
        common: {
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
    it("should assign initial properties", () => {
      const cmd = new DbCreateCommunityautomodsettingCommand({});
      expect(cmd.commandName).to.equal("dbCreateCommunityautomodsetting");
      expect(cmd.objectName).to.equal("communityAutomodSetting");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-community-service-dbevent-communityautomodsetting-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getCommunityAutomodSettingById and indexData", async () => {
      const cmd = new DbCreateCommunityautomodsettingCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getCommunityAutomodSettingByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing communityAutomodSetting if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockcommunityAutomodSetting = { update: updateStub, getData: () => ({ id: 2 }) };

      CommunityAutomodSettingStub.findOne = sandbox.stub().resolves(mockcommunityAutomodSetting);
      CommunityAutomodSettingStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          communityId: "communityId_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateCommunityautomodsettingCommand(input);
      await cmd.runDbCommand();

      expect(input.communityAutomodSetting).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new communityAutomodSetting if no unique match is found", async () => {
      CommunityAutomodSettingStub.findOne = sandbox.stub().resolves(null);
      CommunityAutomodSettingStub.findByPk = sandbox.stub().resolves(null);
      CommunityAutomodSettingStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          communityId: "communityId_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateCommunityautomodsettingCommand(input);
      await cmd.runDbCommand();

      expect(input.communityAutomodSetting).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(CommunityAutomodSettingStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      CommunityAutomodSettingStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateCommunityautomodsettingCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateCommunityautomodsetting", () => {
    it("should execute successfully and return dbData", async () => {
      CommunityAutomodSettingStub.create.resolves({
        getData: () => ({ id: 9 }),
      });

      const input = { dataClause: { name: "communityAutomodSetting" } };
      const result = await dbCreateCommunityautomodsetting(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
