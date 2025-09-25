const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetPolloptionCommand is exported from main code

describe("DbGetPolloptionCommand", () => {
  let DbGetPolloptionCommand, dbGetPolloption;
  let sandbox, PollOptionStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PollOptionStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.pollOptionId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetPolloptionCommand, dbGetPolloption } = proxyquire(
      "../../../../src/db-layer/main/pollOption/dbGetPolloption",
      {
        models: { PollOption: PollOptionStub },
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
      const cmd = new DbGetPolloptionCommand({});
      expect(cmd.commandName).to.equal("dbGetPolloption");
      expect(cmd.objectName).to.equal("pollOption");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call PollOption.getCqrsJoins if exists", async () => {
      const cmd = new DbGetPolloptionCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(PollOptionStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete PollOptionStub.getCqrsJoins;
      const cmd = new DbGetPolloptionCommand({});
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
      const cmd = new DbGetPolloptionCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetPolloptionCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetPolloption", () => {
    it("should execute dbGetPolloption and return pollOption data", async () => {
      const result = await dbGetPolloption({
        pollOptionId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
