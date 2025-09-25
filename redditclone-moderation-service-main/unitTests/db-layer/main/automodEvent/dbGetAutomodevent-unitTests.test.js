const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetAutomodeventCommand is exported from main code

describe("DbGetAutomodeventCommand", () => {
  let DbGetAutomodeventCommand, dbGetAutomodevent;
  let sandbox, AutomodEventStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AutomodEventStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.automodEventId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetAutomodeventCommand, dbGetAutomodevent } = proxyquire(
      "../../../../src/db-layer/main/automodEvent/dbGetAutomodevent",
      {
        models: { AutomodEvent: AutomodEventStub },
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
      const cmd = new DbGetAutomodeventCommand({});
      expect(cmd.commandName).to.equal("dbGetAutomodevent");
      expect(cmd.objectName).to.equal("automodEvent");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call AutomodEvent.getCqrsJoins if exists", async () => {
      const cmd = new DbGetAutomodeventCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(AutomodEventStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete AutomodEventStub.getCqrsJoins;
      const cmd = new DbGetAutomodeventCommand({});
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
      const cmd = new DbGetAutomodeventCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetAutomodeventCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetAutomodevent", () => {
    it("should execute dbGetAutomodevent and return automodEvent data", async () => {
      const result = await dbGetAutomodevent({
        automodEventId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
