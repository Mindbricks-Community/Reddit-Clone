const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetCommentCommand is exported from main code

describe("DbGetCommentCommand", () => {
  let DbGetCommentCommand, dbGetComment;
  let sandbox, CommentStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommentStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.commentId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetCommentCommand, dbGetComment } = proxyquire(
      "../../../../src/db-layer/main/comment/dbGetComment",
      {
        models: { Comment: CommentStub },
        dbCommand: {
          DBGetSequelizeCommand: BaseCommandStub,
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
    it("should set command metadata correctly", () => {
      const cmd = new DbGetCommentCommand({});
      expect(cmd.commandName).to.equal("dbGetComment");
      expect(cmd.objectName).to.equal("comment");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call Comment.getCqrsJoins if exists", async () => {
      const cmd = new DbGetCommentCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(CommentStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete CommentStub.getCqrsJoins;
      const cmd = new DbGetCommentCommand({});
      let errorThrown = false;
      try {
        await cmd.getCqrsJoins({});
      } catch (err) {
        errorThrown = true;
      }

      expect(errorThrown).to.be.false;
    });
  });

  describe("buildIncludes", () => {
    it("should return [] includes", () => {
      const cmd = new DbGetCommentCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetCommentCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetComment", () => {
    it("should execute dbGetComment and return comment data", async () => {
      const result = await dbGetComment({
        commentId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
