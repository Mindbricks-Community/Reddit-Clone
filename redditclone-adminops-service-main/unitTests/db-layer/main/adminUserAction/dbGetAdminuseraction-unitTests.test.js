const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetAdminuseractionCommand is exported from main code

describe("DbGetAdminuseractionCommand", () => {
  let DbGetAdminuseractionCommand, dbGetAdminuseraction;
  let sandbox, AdminUserActionStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AdminUserActionStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.adminUserActionId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetAdminuseractionCommand, dbGetAdminuseraction } = proxyquire(
      "../../../../src/db-layer/main/adminUserAction/dbGetAdminuseraction",
      {
        models: { AdminUserAction: AdminUserActionStub },
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
      const cmd = new DbGetAdminuseractionCommand({});
      expect(cmd.commandName).to.equal("dbGetAdminuseraction");
      expect(cmd.objectName).to.equal("adminUserAction");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call AdminUserAction.getCqrsJoins if exists", async () => {
      const cmd = new DbGetAdminuseractionCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(AdminUserActionStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete AdminUserActionStub.getCqrsJoins;
      const cmd = new DbGetAdminuseractionCommand({});
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
      const cmd = new DbGetAdminuseractionCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetAdminuseractionCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetAdminuseraction", () => {
    it("should execute dbGetAdminuseraction and return adminUserAction data", async () => {
      const result = await dbGetAdminuseraction({
        adminUserActionId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
