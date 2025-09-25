const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetLocalizationkeyCommand is exported from main code

describe("DbGetLocalizationkeyCommand", () => {
  let DbGetLocalizationkeyCommand, dbGetLocalizationkey;
  let sandbox, LocalizationKeyStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationKeyStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.localizationKeyId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetLocalizationkeyCommand, dbGetLocalizationkey } = proxyquire(
      "../../../../src/db-layer/main/localizationKey/dbGetLocalizationkey",
      {
        models: { LocalizationKey: LocalizationKeyStub },
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
      const cmd = new DbGetLocalizationkeyCommand({});
      expect(cmd.commandName).to.equal("dbGetLocalizationkey");
      expect(cmd.objectName).to.equal("localizationKey");
      expect(cmd.serviceLabel).to.equal("redditclone-localization-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call LocalizationKey.getCqrsJoins if exists", async () => {
      const cmd = new DbGetLocalizationkeyCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(LocalizationKeyStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete LocalizationKeyStub.getCqrsJoins;
      const cmd = new DbGetLocalizationkeyCommand({});
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
      const cmd = new DbGetLocalizationkeyCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetLocalizationkeyCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetLocalizationkey", () => {
    it("should execute dbGetLocalizationkey and return localizationKey data", async () => {
      const result = await dbGetLocalizationkey({
        localizationKeyId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
