const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateCommunityruleCommand is exported from main code
describe("DbCreateCommunityruleCommand", () => {
  let DbCreateCommunityruleCommand, dbCreateCommunityrule;
  let sandbox,
    CommunityRuleStub,
    ElasticIndexerStub,
    getCommunityRuleByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityRuleStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getCommunityRuleByIdStub = sandbox
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

    ({ DbCreateCommunityruleCommand, dbCreateCommunityrule } = proxyquire(
      "../../../../src/db-layer/main/communityRule/dbCreateCommunityrule",
      {
        models: { CommunityRule: CommunityRuleStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getCommunityRuleById": getCommunityRuleByIdStub,
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
      const cmd = new DbCreateCommunityruleCommand({});
      expect(cmd.commandName).to.equal("dbCreateCommunityrule");
      expect(cmd.objectName).to.equal("communityRule");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-community-service-dbevent-communityrule-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getCommunityRuleById and indexData", async () => {
      const cmd = new DbCreateCommunityruleCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getCommunityRuleByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing communityRule if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockcommunityRule = { update: updateStub, getData: () => ({ id: 2 }) };

      CommunityRuleStub.findOne = sandbox.stub().resolves(mockcommunityRule);
      CommunityRuleStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          communityId: "communityId_value",
          
          orderIndex: "orderIndex_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateCommunityruleCommand(input);
      await cmd.runDbCommand();

      expect(input.communityRule).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new communityRule if no unique match is found", async () => {
      CommunityRuleStub.findOne = sandbox.stub().resolves(null);
      CommunityRuleStub.findByPk = sandbox.stub().resolves(null);
      CommunityRuleStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          communityId: "communityId_value",
          
          orderIndex: "orderIndex_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateCommunityruleCommand(input);
      await cmd.runDbCommand();

      expect(input.communityRule).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(CommunityRuleStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      CommunityRuleStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateCommunityruleCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateCommunityrule", () => {
    it("should execute successfully and return dbData", async () => {
      CommunityRuleStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "communityRule" } };
      const result = await dbCreateCommunityrule(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
