const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateCommunitymemberCommand is exported from main code
describe("DbCreateCommunitymemberCommand", () => {
  let DbCreateCommunitymemberCommand, dbCreateCommunitymember;
  let sandbox,
    CommunityMemberStub,
    ElasticIndexerStub,
    getCommunityMemberByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityMemberStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getCommunityMemberByIdStub = sandbox
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

    ({ DbCreateCommunitymemberCommand, dbCreateCommunitymember } = proxyquire(
      "../../../../src/db-layer/main/communityMember/dbCreateCommunitymember",
      {
        models: { CommunityMember: CommunityMemberStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getCommunityMemberById": getCommunityMemberByIdStub,
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
      const cmd = new DbCreateCommunitymemberCommand({});
      expect(cmd.commandName).to.equal("dbCreateCommunitymember");
      expect(cmd.objectName).to.equal("communityMember");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-community-service-dbevent-communitymember-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getCommunityMemberById and indexData", async () => {
      const cmd = new DbCreateCommunitymemberCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getCommunityMemberByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing communityMember if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockcommunityMember = { update: updateStub, getData: () => ({ id: 2 }) };

      CommunityMemberStub.findOne = sandbox.stub().resolves(mockcommunityMember);
      CommunityMemberStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          communityId: "communityId_value",
          
          userId: "userId_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateCommunitymemberCommand(input);
      await cmd.runDbCommand();

      expect(input.communityMember).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new communityMember if no unique match is found", async () => {
      CommunityMemberStub.findOne = sandbox.stub().resolves(null);
      CommunityMemberStub.findByPk = sandbox.stub().resolves(null);
      CommunityMemberStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          communityId: "communityId_value",
          
          userId: "userId_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateCommunitymemberCommand(input);
      await cmd.runDbCommand();

      expect(input.communityMember).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(CommunityMemberStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      CommunityMemberStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateCommunitymemberCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateCommunitymember", () => {
    it("should execute successfully and return dbData", async () => {
      CommunityMemberStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "communityMember" } };
      const result = await dbCreateCommunitymember(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
