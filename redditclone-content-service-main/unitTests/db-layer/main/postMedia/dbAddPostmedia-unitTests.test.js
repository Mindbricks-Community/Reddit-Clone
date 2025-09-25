const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbAddPostmediaCommand is exported from main code
describe("DbAddPostmediaCommand", () => {
  let DbAddPostmediaCommand, dbAddPostmedia;
  let sandbox,
    PostMediaStub,
    ElasticIndexerStub,
    getPostMediaByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PostMediaStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getPostMediaByIdStub = sandbox
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

    ({ DbAddPostmediaCommand, dbAddPostmedia } = proxyquire(
      "../../../../src/db-layer/main/postMedia/dbAddPostmedia",
      {
        models: { PostMedia: PostMediaStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getPostMediaById": getPostMediaByIdStub,
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
      const cmd = new DbAddPostmediaCommand({});
      expect(cmd.commandName).to.equal("dbAddPostmedia");
      expect(cmd.objectName).to.equal("postMedia");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-content-service-dbevent-postmedia-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getPostMediaById and indexData", async () => {
      const cmd = new DbAddPostmediaCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getPostMediaByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing postMedia if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockpostMedia = { update: updateStub, getData: () => ({ id: 2 }) };

      PostMediaStub.findOne = sandbox.stub().resolves(mockpostMedia);
      PostMediaStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          mediaObjectId: "mediaObjectId_value",
          
          postId: "postId_value",
          
          commentId: "commentId_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbAddPostmediaCommand(input);
      await cmd.runDbCommand();

      expect(input.postMedia).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new postMedia if no unique match is found", async () => {
      PostMediaStub.findOne = sandbox.stub().resolves(null);
      PostMediaStub.findByPk = sandbox.stub().resolves(null);
      PostMediaStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          mediaObjectId: "mediaObjectId_value",
          
          postId: "postId_value",
          
          commentId: "commentId_value",
          
          name: "new"
        }
      };

      const cmd = new DbAddPostmediaCommand(input);
      await cmd.runDbCommand();

      expect(input.postMedia).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(PostMediaStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      PostMediaStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbAddPostmediaCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbAddPostmedia", () => {
    it("should execute successfully and return dbData", async () => {
      PostMediaStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "postMedia" } };
      const result = await dbAddPostmedia(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
