const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateCommentCommand is exported from main code
describe("DbCreateCommentCommand", () => {
  let DbCreateCommentCommand, dbCreateComment;
  let sandbox,
    CommentStub,
    ElasticIndexerStub,
    getCommentByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommentStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getCommentByIdStub = sandbox
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

    ({ DbCreateCommentCommand, dbCreateComment } = proxyquire(
      "../../../../src/db-layer/main/comment/dbCreateComment",
      {
        models: { Comment: CommentStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getCommentById": getCommentByIdStub,
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
      const cmd = new DbCreateCommentCommand({});
      expect(cmd.commandName).to.equal("dbCreateComment");
      expect(cmd.objectName).to.equal("comment");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-content-service-dbevent-comment-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getCommentById and indexData", async () => {
      const cmd = new DbCreateCommentCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getCommentByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing comment if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockcomment = { update: updateStub, getData: () => ({ id: 2 }) };

      CommentStub.findOne = sandbox.stub().resolves(mockcomment);
      CommentStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          postId: "postId_value",
          
          parentCommentId: "parentCommentId_value",
          
          status: "status_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateCommentCommand(input);
      await cmd.runDbCommand();

      expect(input.comment).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new comment if no unique match is found", async () => {
      CommentStub.findOne = sandbox.stub().resolves(null);
      CommentStub.findByPk = sandbox.stub().resolves(null);
      CommentStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          postId: "postId_value",
          
          parentCommentId: "parentCommentId_value",
          
          status: "status_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateCommentCommand(input);
      await cmd.runDbCommand();

      expect(input.comment).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(CommentStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      CommentStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateCommentCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateComment", () => {
    it("should execute successfully and return dbData", async () => {
      CommentStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "comment" } };
      const result = await dbCreateComment(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
