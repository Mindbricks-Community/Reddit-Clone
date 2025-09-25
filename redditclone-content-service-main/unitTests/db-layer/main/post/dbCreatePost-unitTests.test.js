const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreatePostCommand is exported from main code
describe("DbCreatePostCommand", () => {
  let DbCreatePostCommand, dbCreatePost;
  let sandbox, PostStub, ElasticIndexerStub, getPostByIdStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PostStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getPostByIdStub = sandbox.stub().resolves({ id: 1, name: "Mock Client" });

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

    ({ DbCreatePostCommand, dbCreatePost } = proxyquire(
      "../../../../src/db-layer/main/post/dbCreatePost",
      {
        models: { Post: PostStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getPostById": getPostByIdStub,
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
      const cmd = new DbCreatePostCommand({});
      expect(cmd.commandName).to.equal("dbCreatePost");
      expect(cmd.objectName).to.equal("post");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-content-service-dbevent-post-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getPostById and indexData", async () => {
      const cmd = new DbCreatePostCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getPostByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing post if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockpost = { update: updateStub, getData: () => ({ id: 2 }) };

      PostStub.findOne = sandbox.stub().resolves(mockpost);
      PostStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          communityId: "communityId_value",
          
          status: "status_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreatePostCommand(input);
      await cmd.runDbCommand();

      expect(input.post).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new post if no unique match is found", async () => {
      PostStub.findOne = sandbox.stub().resolves(null);
      PostStub.findByPk = sandbox.stub().resolves(null);
      PostStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          communityId: "communityId_value",
          
          status: "status_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreatePostCommand(input);
      await cmd.runDbCommand();

      expect(input.post).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(PostStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      PostStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreatePostCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreatePost", () => {
    it("should execute successfully and return dbData", async () => {
      PostStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "post" } };
      const result = await dbCreatePost(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
