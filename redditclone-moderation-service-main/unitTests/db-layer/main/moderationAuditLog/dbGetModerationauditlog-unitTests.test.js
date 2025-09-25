const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetModerationauditlogCommand is exported from main code

describe("DbGetModerationauditlogCommand", () => {
  let DbGetModerationauditlogCommand, dbGetModerationauditlog;
  let sandbox, ModerationAuditLogStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationAuditLogStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.moderationAuditLogId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetModerationauditlogCommand, dbGetModerationauditlog } = proxyquire(
      "../../../../src/db-layer/main/moderationAuditLog/dbGetModerationauditlog",
      {
        models: { ModerationAuditLog: ModerationAuditLogStub },
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
      const cmd = new DbGetModerationauditlogCommand({});
      expect(cmd.commandName).to.equal("dbGetModerationauditlog");
      expect(cmd.objectName).to.equal("moderationAuditLog");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call ModerationAuditLog.getCqrsJoins if exists", async () => {
      const cmd = new DbGetModerationauditlogCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(ModerationAuditLogStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete ModerationAuditLogStub.getCqrsJoins;
      const cmd = new DbGetModerationauditlogCommand({});
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
      const cmd = new DbGetModerationauditlogCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetModerationauditlogCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetModerationauditlog", () => {
    it("should execute dbGetModerationauditlog and return moderationAuditLog data", async () => {
      const result = await dbGetModerationauditlog({
        moderationAuditLogId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
