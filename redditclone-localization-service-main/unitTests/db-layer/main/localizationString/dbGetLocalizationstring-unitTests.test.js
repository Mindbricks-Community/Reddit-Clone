const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetLocalizationstringCommand is exported from main code

describe("DbGetLocalizationstringCommand", () => {
  let DbGetLocalizationstringCommand, dbGetLocalizationstring;
  let sandbox, LocalizationStringStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationStringStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.localizationStringId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetLocalizationstringCommand, dbGetLocalizationstring } = proxyquire(
      "../../../../src/db-layer/main/localizationString/dbGetLocalizationstring",
      {
        models: { LocalizationString: LocalizationStringStub },
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
      const cmd = new DbGetLocalizationstringCommand({});
      expect(cmd.commandName).to.equal("dbGetLocalizationstring");
      expect(cmd.objectName).to.equal("localizationString");
      expect(cmd.serviceLabel).to.equal("redditclone-localization-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call LocalizationString.getCqrsJoins if exists", async () => {
      const cmd = new DbGetLocalizationstringCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(LocalizationStringStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete LocalizationStringStub.getCqrsJoins;
      const cmd = new DbGetLocalizationstringCommand({});
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
      const cmd = new DbGetLocalizationstringCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetLocalizationstringCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetLocalizationstring", () => {
    it("should execute dbGetLocalizationstring and return localizationString data", async () => {
      const result = await dbGetLocalizationstring({
        localizationStringId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
