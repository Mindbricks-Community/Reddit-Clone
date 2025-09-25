const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetGdprdeleterequestCommand is exported from main code

describe("DbGetGdprdeleterequestCommand", () => {
  let DbGetGdprdeleterequestCommand, dbGetGdprdeleterequest;
  let sandbox, GdprDeleteRequestStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprDeleteRequestStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.gdprDeleteRequestId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetGdprdeleterequestCommand, dbGetGdprdeleterequest } = proxyquire(
      "../../../../src/db-layer/main/gdprDeleteRequest/dbGetGdprdeleterequest",
      {
        models: { GdprDeleteRequest: GdprDeleteRequestStub },
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
      const cmd = new DbGetGdprdeleterequestCommand({});
      expect(cmd.commandName).to.equal("dbGetGdprdeleterequest");
      expect(cmd.objectName).to.equal("gdprDeleteRequest");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call GdprDeleteRequest.getCqrsJoins if exists", async () => {
      const cmd = new DbGetGdprdeleterequestCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(GdprDeleteRequestStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete GdprDeleteRequestStub.getCqrsJoins;
      const cmd = new DbGetGdprdeleterequestCommand({});
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
      const cmd = new DbGetGdprdeleterequestCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetGdprdeleterequestCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetGdprdeleterequest", () => {
    it("should execute dbGetGdprdeleterequest and return gdprDeleteRequest data", async () => {
      const result = await dbGetGdprdeleterequest({
        gdprDeleteRequestId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
