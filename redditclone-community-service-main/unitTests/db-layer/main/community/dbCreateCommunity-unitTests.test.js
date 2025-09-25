const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateCommunityCommand is exported from main code
describe("DbCreateCommunityCommand", () => {
  let DbCreateCommunityCommand, dbCreateCommunity;
  let sandbox,
    CommunityStub,
    ElasticIndexerStub,
    getCommunityByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getCommunityByIdStub = sandbox
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

    ({ DbCreateCommunityCommand, dbCreateCommunity } = proxyquire(
      "../../../../src/db-layer/main/community/dbCreateCommunity",
      {
        models: { Community: CommunityStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getCommunityById": getCommunityByIdStub,
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
      const cmd = new DbCreateCommunityCommand({});
      expect(cmd.commandName).to.equal("dbCreateCommunity");
      expect(cmd.objectName).to.equal("community");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-community-service-dbevent-community-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getCommunityById and indexData", async () => {
      const cmd = new DbCreateCommunityCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getCommunityByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing community if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockcommunity = { update: updateStub, getData: () => ({ id: 2 }) };

      CommunityStub.findOne = sandbox.stub().resolves(mockcommunity);
      CommunityStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          slug: "slug_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateCommunityCommand(input);
      await cmd.runDbCommand();

      expect(input.community).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new community if no unique match is found", async () => {
      CommunityStub.findOne = sandbox.stub().resolves(null);
      CommunityStub.findByPk = sandbox.stub().resolves(null);
      CommunityStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          slug: "slug_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateCommunityCommand(input);
      await cmd.runDbCommand();

      expect(input.community).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(CommunityStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      CommunityStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateCommunityCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateCommunity", () => {
    it("should execute successfully and return dbData", async () => {
      CommunityStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "community" } };
      const result = await dbCreateCommunity(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
