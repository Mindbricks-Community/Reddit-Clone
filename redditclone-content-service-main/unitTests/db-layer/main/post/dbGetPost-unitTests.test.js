const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetPostCommand is exported from main code

describe("DbGetPostCommand", () => {
  let DbGetPostCommand, dbGetPost;
  let sandbox, PostStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PostStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.postId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetPostCommand, dbGetPost } = proxyquire(
      "../../../../src/db-layer/main/post/dbGetPost",
      {
        models: { Post: PostStub },
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
      const cmd = new DbGetPostCommand({});
      expect(cmd.commandName).to.equal("dbGetPost");
      expect(cmd.objectName).to.equal("post");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call Post.getCqrsJoins if exists", async () => {
      const cmd = new DbGetPostCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(PostStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete PostStub.getCqrsJoins;
      const cmd = new DbGetPostCommand({});
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
      const cmd = new DbGetPostCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetPostCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetPost", () => {
    it("should execute dbGetPost and return post data", async () => {
      const result = await dbGetPost({
        postId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
