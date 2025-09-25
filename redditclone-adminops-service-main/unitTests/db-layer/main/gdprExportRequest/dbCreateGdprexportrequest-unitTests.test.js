const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateGdprexportrequestCommand is exported from main code
describe("DbCreateGdprexportrequestCommand", () => {
  let DbCreateGdprexportrequestCommand, dbCreateGdprexportrequest;
  let sandbox,
    GdprExportRequestStub,
    ElasticIndexerStub,
    getGdprExportRequestByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprExportRequestStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getGdprExportRequestByIdStub = sandbox
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

    ({ DbCreateGdprexportrequestCommand, dbCreateGdprexportrequest } =
      proxyquire(
        "../../../../src/db-layer/main/gdprExportRequest/dbCreateGdprexportrequest",
        {
          models: { GdprExportRequest: GdprExportRequestStub },
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          "./utils/getGdprExportRequestById": getGdprExportRequestByIdStub,
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
      const cmd = new DbCreateGdprexportrequestCommand({});
      expect(cmd.commandName).to.equal("dbCreateGdprexportrequest");
      expect(cmd.objectName).to.equal("gdprExportRequest");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-adminops-service-dbevent-gdprexportrequest-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getGdprExportRequestById and indexData", async () => {
      const cmd = new DbCreateGdprexportrequestCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getGdprExportRequestByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing gdprExportRequest if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockgdprExportRequest = { update: updateStub, getData: () => ({ id: 2 }) };

      GdprExportRequestStub.findOne = sandbox.stub().resolves(mockgdprExportRequest);
      GdprExportRequestStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateGdprexportrequestCommand(input);
      await cmd.runDbCommand();

      expect(input.gdprExportRequest).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new gdprExportRequest if no unique match is found", async () => {
      GdprExportRequestStub.findOne = sandbox.stub().resolves(null);
      GdprExportRequestStub.findByPk = sandbox.stub().resolves(null);
      GdprExportRequestStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateGdprexportrequestCommand(input);
      await cmd.runDbCommand();

      expect(input.gdprExportRequest).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(GdprExportRequestStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      GdprExportRequestStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateGdprexportrequestCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateGdprexportrequest", () => {
    it("should execute successfully and return dbData", async () => {
      GdprExportRequestStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "gdprExportRequest" } };
      const result = await dbCreateGdprexportrequest(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
