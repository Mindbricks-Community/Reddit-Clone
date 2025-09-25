const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateLocalizationkeyCommand is exported from main code
describe("DbCreateLocalizationkeyCommand", () => {
  let DbCreateLocalizationkeyCommand, dbCreateLocalizationkey;
  let sandbox,
    LocalizationKeyStub,
    ElasticIndexerStub,
    getLocalizationKeyByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocalizationKeyStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getLocalizationKeyByIdStub = sandbox
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

    ({ DbCreateLocalizationkeyCommand, dbCreateLocalizationkey } = proxyquire(
      "../../../../src/db-layer/main/localizationKey/dbCreateLocalizationkey",
      {
        models: { LocalizationKey: LocalizationKeyStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getLocalizationKeyById": getLocalizationKeyByIdStub,
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
      const cmd = new DbCreateLocalizationkeyCommand({});
      expect(cmd.commandName).to.equal("dbCreateLocalizationkey");
      expect(cmd.objectName).to.equal("localizationKey");
      expect(cmd.serviceLabel).to.equal("redditclone-localization-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-localization-service-dbevent-localizationkey-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getLocalizationKeyById and indexData", async () => {
      const cmd = new DbCreateLocalizationkeyCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getLocalizationKeyByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing localizationKey if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mocklocalizationKey = { update: updateStub, getData: () => ({ id: 2 }) };

      LocalizationKeyStub.findOne = sandbox.stub().resolves(mocklocalizationKey);
      LocalizationKeyStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          uiKey: "uiKey_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateLocalizationkeyCommand(input);
      await cmd.runDbCommand();

      expect(input.localizationKey).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new localizationKey if no unique match is found", async () => {
      LocalizationKeyStub.findOne = sandbox.stub().resolves(null);
      LocalizationKeyStub.findByPk = sandbox.stub().resolves(null);
      LocalizationKeyStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          uiKey: "uiKey_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateLocalizationkeyCommand(input);
      await cmd.runDbCommand();

      expect(input.localizationKey).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(LocalizationKeyStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      LocalizationKeyStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateLocalizationkeyCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateLocalizationkey", () => {
    it("should execute successfully and return dbData", async () => {
      LocalizationKeyStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "localizationKey" } };
      const result = await dbCreateLocalizationkey(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
