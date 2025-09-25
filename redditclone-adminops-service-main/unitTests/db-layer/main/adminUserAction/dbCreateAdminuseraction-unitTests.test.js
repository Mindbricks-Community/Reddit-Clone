const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateAdminuseractionCommand is exported from main code
describe("DbCreateAdminuseractionCommand", () => {
  let DbCreateAdminuseractionCommand, dbCreateAdminuseraction;
  let sandbox,
    AdminUserActionStub,
    ElasticIndexerStub,
    getAdminUserActionByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AdminUserActionStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getAdminUserActionByIdStub = sandbox
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

    ({ DbCreateAdminuseractionCommand, dbCreateAdminuseraction } = proxyquire(
      "../../../../src/db-layer/main/adminUserAction/dbCreateAdminuseraction",
      {
        models: { AdminUserAction: AdminUserActionStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getAdminUserActionById": getAdminUserActionByIdStub,
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
      const cmd = new DbCreateAdminuseractionCommand({});
      expect(cmd.commandName).to.equal("dbCreateAdminuseraction");
      expect(cmd.objectName).to.equal("adminUserAction");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-adminops-service-dbevent-adminuseraction-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getAdminUserActionById and indexData", async () => {
      const cmd = new DbCreateAdminuseractionCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getAdminUserActionByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing adminUserAction if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockadminUserAction = { update: updateStub, getData: () => ({ id: 2 }) };

      AdminUserActionStub.findOne = sandbox.stub().resolves(mockadminUserAction);
      AdminUserActionStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateAdminuseractionCommand(input);
      await cmd.runDbCommand();

      expect(input.adminUserAction).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new adminUserAction if no unique match is found", async () => {
      AdminUserActionStub.findOne = sandbox.stub().resolves(null);
      AdminUserActionStub.findByPk = sandbox.stub().resolves(null);
      AdminUserActionStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateAdminuseractionCommand(input);
      await cmd.runDbCommand();

      expect(input.adminUserAction).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(AdminUserActionStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      AdminUserActionStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateAdminuseractionCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateAdminuseraction", () => {
    it("should execute successfully and return dbData", async () => {
      AdminUserActionStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "adminUserAction" } };
      const result = await dbCreateAdminuseraction(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
