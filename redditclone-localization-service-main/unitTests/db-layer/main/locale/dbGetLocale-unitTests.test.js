const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetLocaleCommand is exported from main code

describe("DbGetLocaleCommand", () => {
  let DbGetLocaleCommand, dbGetLocale;
  let sandbox, LocaleStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocaleStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.localeId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetLocaleCommand, dbGetLocale } = proxyquire(
      "../../../../src/db-layer/main/locale/dbGetLocale",
      {
        models: { Locale: LocaleStub },
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
      const cmd = new DbGetLocaleCommand({});
      expect(cmd.commandName).to.equal("dbGetLocale");
      expect(cmd.objectName).to.equal("locale");
      expect(cmd.serviceLabel).to.equal("redditclone-localization-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call Locale.getCqrsJoins if exists", async () => {
      const cmd = new DbGetLocaleCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(LocaleStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete LocaleStub.getCqrsJoins;
      const cmd = new DbGetLocaleCommand({});
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
      const cmd = new DbGetLocaleCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetLocaleCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetLocale", () => {
    it("should execute dbGetLocale and return locale data", async () => {
      const result = await dbGetLocale({
        localeId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
