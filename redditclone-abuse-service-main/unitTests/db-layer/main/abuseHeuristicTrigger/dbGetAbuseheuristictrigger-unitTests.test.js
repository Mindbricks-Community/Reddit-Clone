const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetAbuseheuristictriggerCommand is exported from main code

describe("DbGetAbuseheuristictriggerCommand", () => {
  let DbGetAbuseheuristictriggerCommand, dbGetAbuseheuristictrigger;
  let sandbox, AbuseHeuristicTriggerStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseHeuristicTriggerStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.abuseHeuristicTriggerId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetAbuseheuristictriggerCommand, dbGetAbuseheuristictrigger } =
      proxyquire(
        "../../../../src/db-layer/main/abuseHeuristicTrigger/dbGetAbuseheuristictrigger",
        {
          models: { AbuseHeuristicTrigger: AbuseHeuristicTriggerStub },
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
      const cmd = new DbGetAbuseheuristictriggerCommand({});
      expect(cmd.commandName).to.equal("dbGetAbuseheuristictrigger");
      expect(cmd.objectName).to.equal("abuseHeuristicTrigger");
      expect(cmd.serviceLabel).to.equal("redditclone-abuse-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call AbuseHeuristicTrigger.getCqrsJoins if exists", async () => {
      const cmd = new DbGetAbuseheuristictriggerCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(AbuseHeuristicTriggerStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete AbuseHeuristicTriggerStub.getCqrsJoins;
      const cmd = new DbGetAbuseheuristictriggerCommand({});
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
      const cmd = new DbGetAbuseheuristictriggerCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetAbuseheuristictriggerCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetAbuseheuristictrigger", () => {
    it("should execute dbGetAbuseheuristictrigger and return abuseHeuristicTrigger data", async () => {
      const result = await dbGetAbuseheuristictrigger({
        abuseHeuristicTriggerId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
