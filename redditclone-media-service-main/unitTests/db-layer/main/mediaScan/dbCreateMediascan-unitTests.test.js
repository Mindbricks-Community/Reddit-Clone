const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateMediascanCommand is exported from main code
describe("DbCreateMediascanCommand", () => {
  let DbCreateMediascanCommand, dbCreateMediascan;
  let sandbox,
    MediaScanStub,
    ElasticIndexerStub,
    getMediaScanByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaScanStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getMediaScanByIdStub = sandbox
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

    ({ DbCreateMediascanCommand, dbCreateMediascan } = proxyquire(
      "../../../../src/db-layer/main/mediaScan/dbCreateMediascan",
      {
        models: { MediaScan: MediaScanStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getMediaScanById": getMediaScanByIdStub,
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
      const cmd = new DbCreateMediascanCommand({});
      expect(cmd.commandName).to.equal("dbCreateMediascan");
      expect(cmd.objectName).to.equal("mediaScan");
      expect(cmd.serviceLabel).to.equal("redditclone-media-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-media-service-dbevent-mediascan-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getMediaScanById and indexData", async () => {
      const cmd = new DbCreateMediascanCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getMediaScanByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing mediaScan if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockmediaScan = { update: updateStub, getData: () => ({ id: 2 }) };

      MediaScanStub.findOne = sandbox.stub().resolves(mockmediaScan);
      MediaScanStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateMediascanCommand(input);
      await cmd.runDbCommand();

      expect(input.mediaScan).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new mediaScan if no unique match is found", async () => {
      MediaScanStub.findOne = sandbox.stub().resolves(null);
      MediaScanStub.findByPk = sandbox.stub().resolves(null);
      MediaScanStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateMediascanCommand(input);
      await cmd.runDbCommand();

      expect(input.mediaScan).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(MediaScanStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      MediaScanStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateMediascanCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateMediascan", () => {
    it("should execute successfully and return dbData", async () => {
      MediaScanStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "mediaScan" } };
      const result = await dbCreateMediascan(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
