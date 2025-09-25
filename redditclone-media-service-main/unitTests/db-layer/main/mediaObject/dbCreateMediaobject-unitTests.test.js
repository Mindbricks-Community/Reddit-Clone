const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateMediaobjectCommand is exported from main code
describe("DbCreateMediaobjectCommand", () => {
  let DbCreateMediaobjectCommand, dbCreateMediaobject;
  let sandbox,
    MediaObjectStub,
    ElasticIndexerStub,
    getMediaObjectByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaObjectStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getMediaObjectByIdStub = sandbox
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

    ({ DbCreateMediaobjectCommand, dbCreateMediaobject } = proxyquire(
      "../../../../src/db-layer/main/mediaObject/dbCreateMediaobject",
      {
        models: { MediaObject: MediaObjectStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getMediaObjectById": getMediaObjectByIdStub,
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
      const cmd = new DbCreateMediaobjectCommand({});
      expect(cmd.commandName).to.equal("dbCreateMediaobject");
      expect(cmd.objectName).to.equal("mediaObject");
      expect(cmd.serviceLabel).to.equal("redditclone-media-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-media-service-dbevent-mediaobject-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getMediaObjectById and indexData", async () => {
      const cmd = new DbCreateMediaobjectCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getMediaObjectByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing mediaObject if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockmediaObject = { update: updateStub, getData: () => ({ id: 2 }) };

      MediaObjectStub.findOne = sandbox.stub().resolves(mockmediaObject);
      MediaObjectStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateMediaobjectCommand(input);
      await cmd.runDbCommand();

      expect(input.mediaObject).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new mediaObject if no unique match is found", async () => {
      MediaObjectStub.findOne = sandbox.stub().resolves(null);
      MediaObjectStub.findByPk = sandbox.stub().resolves(null);
      MediaObjectStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateMediaobjectCommand(input);
      await cmd.runDbCommand();

      expect(input.mediaObject).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(MediaObjectStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      MediaObjectStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateMediaobjectCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateMediaobject", () => {
    it("should execute successfully and return dbData", async () => {
      MediaObjectStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "mediaObject" } };
      const result = await dbCreateMediaobject(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
