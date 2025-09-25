const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateLocalizationstringCommand is exported from main code
describe("DbCreateLocalizationstringCommand", () => {
  let DbCreateLocalizationstringCommand, dbCreateLocalizationstring;
  let sandbox,
    LocalizationStringStub,
    ElasticIndexerStub,
    getLocalizationStringByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationStringStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getLocalizationStringByIdStub = sandbox
      .stub()
      .resolves({ id: 1, name: "Mock Client" });

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input) {
        this.input = input;
        this.dataClause = input.dataClause || {};
        this.session = input.session;
        this.requestId = input.requestId;
        this.dbData = { id: 9 };
      }

      async runDbCommand() {}
      async execute() {
        return this.dbData;
      }
      loadHookFunctions() {}
      createEntityCacher() {}
      normalizeSequalizeOps(w) {
        return w;
      }
      createQueryCacheInvalidator() {}
    };

    ({ DbCreateLocalizationstringCommand, dbCreateLocalizationstring } =
      proxyquire(
        "../../../../src/db-layer/main/localizationString/dbCreateLocalizationstring",
        {
          models: { LocalizationString: LocalizationStringStub },
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          "./utils/getLocalizationStringById": getLocalizationStringByIdStub,
          dbCommand: { DBCreateSequelizeCommand: BaseCommandStub },
          "./query-cache-classes": {
            ClientQueryCacheInvalidator: sandbox.stub(),
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
    it("should assign initial properties", () => {
      const cmd = new DbCreateLocalizationstringCommand({});
      expect(cmd.commandName).to.equal("dbCreateLocalizationstring");
      expect(cmd.objectName).to.equal("localizationString");
      expect(cmd.serviceLabel).to.equal("redditclone-localization-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-localization-service-dbevent-localizationstring-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getLocalizationStringById and indexData", async () => {
      const cmd = new DbCreateLocalizationstringCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getLocalizationStringByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing localizationString if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mocklocalizationString = { update: updateStub, getData: () => ({ id: 2 }) };

      LocalizationStringStub.findOne = sandbox.stub().resolves(mocklocalizationString);
      LocalizationStringStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          keyId: "keyId_value",
          
          localeId: "localeId_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateLocalizationstringCommand(input);
      await cmd.runDbCommand();

      expect(input.localizationString).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new localizationString if no unique match is found", async () => {
      LocalizationStringStub.findOne = sandbox.stub().resolves(null);
      LocalizationStringStub.findByPk = sandbox.stub().resolves(null);
      LocalizationStringStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          keyId: "keyId_value",
          
          localeId: "localeId_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateLocalizationstringCommand(input);
      await cmd.runDbCommand();

      expect(input.localizationString).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(LocalizationStringStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      LocalizationStringStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateLocalizationstringCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateLocalizationstring", () => {
    it("should execute successfully and return dbData", async () => {
      LocalizationStringStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "localizationString" } };
      const result = await dbCreateLocalizationstring(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
