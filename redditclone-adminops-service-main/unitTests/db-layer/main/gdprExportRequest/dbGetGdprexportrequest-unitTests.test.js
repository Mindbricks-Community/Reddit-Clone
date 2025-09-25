const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetGdprexportrequestCommand is exported from main code

describe("DbGetGdprexportrequestCommand", () => {
  let DbGetGdprexportrequestCommand, dbGetGdprexportrequest;
  let sandbox, GdprExportRequestStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprExportRequestStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.gdprExportRequestId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetGdprexportrequestCommand, dbGetGdprexportrequest } = proxyquire(
      "../../../../src/db-layer/main/gdprExportRequest/dbGetGdprexportrequest",
      {
        models: { GdprExportRequest: GdprExportRequestStub },
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
      const cmd = new DbGetGdprexportrequestCommand({});
      expect(cmd.commandName).to.equal("dbGetGdprexportrequest");
      expect(cmd.objectName).to.equal("gdprExportRequest");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call GdprExportRequest.getCqrsJoins if exists", async () => {
      const cmd = new DbGetGdprexportrequestCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(GdprExportRequestStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete GdprExportRequestStub.getCqrsJoins;
      const cmd = new DbGetGdprexportrequestCommand({});
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
      const cmd = new DbGetGdprexportrequestCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetGdprexportrequestCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetGdprexportrequest", () => {
    it("should execute dbGetGdprexportrequest and return gdprExportRequest data", async () => {
      const result = await dbGetGdprexportrequest({
        gdprExportRequestId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
