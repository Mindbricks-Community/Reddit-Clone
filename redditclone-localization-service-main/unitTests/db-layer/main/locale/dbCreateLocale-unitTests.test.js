const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateLocaleCommand is exported from main code
describe("DbCreateLocaleCommand", () => {
  let DbCreateLocaleCommand, dbCreateLocale;
  let sandbox,
    LocaleStub,
    ElasticIndexerStub,
    getLocaleByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    LocaleStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getLocaleByIdStub = sandbox.stub().resolves({ id: 1, name: "Mock Client" });

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

    ({ DbCreateLocaleCommand, dbCreateLocale } = proxyquire(
      "../../../../src/db-layer/main/locale/dbCreateLocale",
      {
        models: { Locale: LocaleStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getLocaleById": getLocaleByIdStub,
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
      const cmd = new DbCreateLocaleCommand({});
      expect(cmd.commandName).to.equal("dbCreateLocale");
      expect(cmd.objectName).to.equal("locale");
      expect(cmd.serviceLabel).to.equal("redditclone-localization-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-localization-service-dbevent-locale-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getLocaleById and indexData", async () => {
      const cmd = new DbCreateLocaleCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getLocaleByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing locale if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mocklocale = { update: updateStub, getData: () => ({ id: 2 }) };

      LocaleStub.findOne = sandbox.stub().resolves(mocklocale);
      LocaleStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateLocaleCommand(input);
      await cmd.runDbCommand();

      expect(input.locale).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new locale if no unique match is found", async () => {
      LocaleStub.findOne = sandbox.stub().resolves(null);
      LocaleStub.findByPk = sandbox.stub().resolves(null);
      LocaleStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateLocaleCommand(input);
      await cmd.runDbCommand();

      expect(input.locale).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(LocaleStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      LocaleStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateLocaleCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateLocale", () => {
    it("should execute successfully and return dbData", async () => {
      LocaleStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "locale" } };
      const result = await dbCreateLocale(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
