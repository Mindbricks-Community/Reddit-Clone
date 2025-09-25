const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetModmailmessageCommand is exported from main code

describe("DbGetModmailmessageCommand", () => {
  let DbGetModmailmessageCommand, dbGetModmailmessage;
  let sandbox, ModmailMessageStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModmailMessageStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.modmailMessageId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetModmailmessageCommand, dbGetModmailmessage } = proxyquire(
      "../../../../src/db-layer/main/modmailMessage/dbGetModmailmessage",
      {
        models: { ModmailMessage: ModmailMessageStub },
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
      const cmd = new DbGetModmailmessageCommand({});
      expect(cmd.commandName).to.equal("dbGetModmailmessage");
      expect(cmd.objectName).to.equal("modmailMessage");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call ModmailMessage.getCqrsJoins if exists", async () => {
      const cmd = new DbGetModmailmessageCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(ModmailMessageStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete ModmailMessageStub.getCqrsJoins;
      const cmd = new DbGetModmailmessageCommand({});
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
      const cmd = new DbGetModmailmessageCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetModmailmessageCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetModmailmessage", () => {
    it("should execute dbGetModmailmessage and return modmailMessage data", async () => {
      const result = await dbGetModmailmessage({
        modmailMessageId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
