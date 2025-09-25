const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetPostmediaCommand is exported from main code

describe("DbGetPostmediaCommand", () => {
  let DbGetPostmediaCommand, dbGetPostmedia;
  let sandbox, PostMediaStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PostMediaStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.postMediaId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetPostmediaCommand, dbGetPostmedia } = proxyquire(
      "../../../../src/db-layer/main/postMedia/dbGetPostmedia",
      {
        models: { PostMedia: PostMediaStub },
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
      const cmd = new DbGetPostmediaCommand({});
      expect(cmd.commandName).to.equal("dbGetPostmedia");
      expect(cmd.objectName).to.equal("postMedia");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call PostMedia.getCqrsJoins if exists", async () => {
      const cmd = new DbGetPostmediaCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(PostMediaStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete PostMediaStub.getCqrsJoins;
      const cmd = new DbGetPostmediaCommand({});
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
      const cmd = new DbGetPostmediaCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetPostmediaCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetPostmedia", () => {
    it("should execute dbGetPostmedia and return postMedia data", async () => {
      const result = await dbGetPostmedia({
        postMediaId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
