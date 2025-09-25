const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteAdminuseractionCommand is exported from main code

describe("DbDeleteAdminuseractionCommand", () => {
  let DbDeleteAdminuseractionCommand, dbDeleteAdminuseraction;
  let sandbox,
    AdminUserActionStub,
    getAdminUserActionByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AdminUserActionStub = {};

    getAdminUserActionByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.adminUserActionId || 123 };
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

    ({ DbDeleteAdminuseractionCommand, dbDeleteAdminuseraction } = proxyquire(
      "../../../../src/db-layer/main/adminUserAction/dbDeleteAdminuseraction",
      {
        models: { AdminUserAction: AdminUserActionStub },
        "./query-cache-classes": {
          AdminUserActionQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getAdminUserActionById": getAdminUserActionByIdStub,
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
      const cmd = new DbDeleteAdminuseractionCommand({});
      expect(cmd.commandName).to.equal("dbDeleteAdminuseraction");
      expect(cmd.objectName).to.equal("adminUserAction");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-adminops-service-dbevent-adminuseraction-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteAdminuseractionCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteAdminuseraction", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getAdminUserActionByIdStub.resolves(mockInstance);

      const input = {
        adminUserActionId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteAdminuseraction(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
