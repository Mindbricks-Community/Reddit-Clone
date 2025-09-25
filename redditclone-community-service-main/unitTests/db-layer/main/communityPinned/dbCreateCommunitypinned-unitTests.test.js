const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateCommunitypinnedCommand is exported from main code
describe("DbCreateCommunitypinnedCommand", () => {
  let DbCreateCommunitypinnedCommand, dbCreateCommunitypinned;
  let sandbox,
    CommunityPinnedStub,
    ElasticIndexerStub,
    getCommunityPinnedByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityPinnedStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getCommunityPinnedByIdStub = sandbox
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

    ({ DbCreateCommunitypinnedCommand, dbCreateCommunitypinned } = proxyquire(
      "../../../../src/db-layer/main/communityPinned/dbCreateCommunitypinned",
      {
        models: { CommunityPinned: CommunityPinnedStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getCommunityPinnedById": getCommunityPinnedByIdStub,
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
      const cmd = new DbCreateCommunitypinnedCommand({});
      expect(cmd.commandName).to.equal("dbCreateCommunitypinned");
      expect(cmd.objectName).to.equal("communityPinned");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-community-service-dbevent-communitypinned-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getCommunityPinnedById and indexData", async () => {
      const cmd = new DbCreateCommunitypinnedCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getCommunityPinnedByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing communityPinned if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockcommunityPinned = { update: updateStub, getData: () => ({ id: 2 }) };

      CommunityPinnedStub.findOne = sandbox.stub().resolves(mockcommunityPinned);
      CommunityPinnedStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          communityId: "communityId_value",
          
          orderIndex: "orderIndex_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateCommunitypinnedCommand(input);
      await cmd.runDbCommand();

      expect(input.communityPinned).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new communityPinned if no unique match is found", async () => {
      CommunityPinnedStub.findOne = sandbox.stub().resolves(null);
      CommunityPinnedStub.findByPk = sandbox.stub().resolves(null);
      CommunityPinnedStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          communityId: "communityId_value",
          
          orderIndex: "orderIndex_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateCommunitypinnedCommand(input);
      await cmd.runDbCommand();

      expect(input.communityPinned).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(CommunityPinnedStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      CommunityPinnedStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateCommunitypinnedCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateCommunitypinned", () => {
    it("should execute successfully and return dbData", async () => {
      CommunityPinnedStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "communityPinned" } };
      const result = await dbCreateCommunitypinned(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
