const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteCommentCommand is exported from main code

describe("DbDeleteCommentCommand", () => {
  let DbDeleteCommentCommand, dbDeleteComment;
  let sandbox,
    CommentStub,
    getCommentByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommentStub = {};

    getCommentByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.commentId || 123 };
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

    ({ DbDeleteCommentCommand, dbDeleteComment } = proxyquire(
      "../../../../src/db-layer/main/comment/dbDeleteComment",
      {
        models: { Comment: CommentStub },
        "./query-cache-classes": {
          CommentQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getCommentById": getCommentByIdStub,
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
      const cmd = new DbDeleteCommentCommand({});
      expect(cmd.commandName).to.equal("dbDeleteComment");
      expect(cmd.objectName).to.equal("comment");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-content-service-dbevent-comment-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteCommentCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteComment", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getCommentByIdStub.resolves(mockInstance);

      const input = {
        commentId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteComment(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
