const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetModerationactionCommand is exported from main code

describe("DbGetModerationactionCommand", () => {
  let DbGetModerationactionCommand, dbGetModerationaction;
  let sandbox, ModerationActionStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationActionStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.moderationActionId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetModerationactionCommand, dbGetModerationaction } = proxyquire(
      "../../../../src/db-layer/main/moderationAction/dbGetModerationaction",
      {
        models: { ModerationAction: ModerationActionStub },
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
      const cmd = new DbGetModerationactionCommand({});
      expect(cmd.commandName).to.equal("dbGetModerationaction");
      expect(cmd.objectName).to.equal("moderationAction");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call ModerationAction.getCqrsJoins if exists", async () => {
      const cmd = new DbGetModerationactionCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(ModerationActionStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete ModerationActionStub.getCqrsJoins;
      const cmd = new DbGetModerationactionCommand({});
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
      const cmd = new DbGetModerationactionCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetModerationactionCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetModerationaction", () => {
    it("should execute dbGetModerationaction and return moderationAction data", async () => {
      const result = await dbGetModerationaction({
        moderationActionId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
