const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateGdprdeleterequestCommand is exported from main code
describe("DbCreateGdprdeleterequestCommand", () => {
  let DbCreateGdprdeleterequestCommand, dbCreateGdprdeleterequest;
  let sandbox,
    GdprDeleteRequestStub,
    ElasticIndexerStub,
    getGdprDeleteRequestByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprDeleteRequestStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getGdprDeleteRequestByIdStub = sandbox
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

    ({ DbCreateGdprdeleterequestCommand, dbCreateGdprdeleterequest } =
      proxyquire(
        "../../../../src/db-layer/main/gdprDeleteRequest/dbCreateGdprdeleterequest",
        {
          models: { GdprDeleteRequest: GdprDeleteRequestStub },
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          "./utils/getGdprDeleteRequestById": getGdprDeleteRequestByIdStub,
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
      const cmd = new DbCreateGdprdeleterequestCommand({});
      expect(cmd.commandName).to.equal("dbCreateGdprdeleterequest");
      expect(cmd.objectName).to.equal("gdprDeleteRequest");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-adminops-service-dbevent-gdprdeleterequest-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getGdprDeleteRequestById and indexData", async () => {
      const cmd = new DbCreateGdprdeleterequestCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getGdprDeleteRequestByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing gdprDeleteRequest if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockgdprDeleteRequest = { update: updateStub, getData: () => ({ id: 2 }) };

      GdprDeleteRequestStub.findOne = sandbox.stub().resolves(mockgdprDeleteRequest);
      GdprDeleteRequestStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateGdprdeleterequestCommand(input);
      await cmd.runDbCommand();

      expect(input.gdprDeleteRequest).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new gdprDeleteRequest if no unique match is found", async () => {
      GdprDeleteRequestStub.findOne = sandbox.stub().resolves(null);
      GdprDeleteRequestStub.findByPk = sandbox.stub().resolves(null);
      GdprDeleteRequestStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateGdprdeleterequestCommand(input);
      await cmd.runDbCommand();

      expect(input.gdprDeleteRequest).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(GdprDeleteRequestStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      GdprDeleteRequestStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateGdprdeleterequestCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateGdprdeleterequest", () => {
    it("should execute successfully and return dbData", async () => {
      GdprDeleteRequestStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "gdprDeleteRequest" } };
      const result = await dbCreateGdprdeleterequest(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
