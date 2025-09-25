const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetModmailthreadCommand is exported from main code

describe("DbGetModmailthreadCommand", () => {
  let DbGetModmailthreadCommand, dbGetModmailthread;
  let sandbox, ModmailThreadStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModmailThreadStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.modmailThreadId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetModmailthreadCommand, dbGetModmailthread } = proxyquire(
      "../../../../src/db-layer/main/modmailThread/dbGetModmailthread",
      {
        models: { ModmailThread: ModmailThreadStub },
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
      const cmd = new DbGetModmailthreadCommand({});
      expect(cmd.commandName).to.equal("dbGetModmailthread");
      expect(cmd.objectName).to.equal("modmailThread");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call ModmailThread.getCqrsJoins if exists", async () => {
      const cmd = new DbGetModmailthreadCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(ModmailThreadStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete ModmailThreadStub.getCqrsJoins;
      const cmd = new DbGetModmailthreadCommand({});
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
      const cmd = new DbGetModmailthreadCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetModmailthreadCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetModmailthread", () => {
    it("should execute dbGetModmailthread and return modmailThread data", async () => {
      const result = await dbGetModmailthread({
        modmailThreadId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
