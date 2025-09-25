const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateGlobaluserrestrictionCommand is exported from main code
describe("DbCreateGlobaluserrestrictionCommand", () => {
  let DbCreateGlobaluserrestrictionCommand, dbCreateGlobaluserrestriction;
  let sandbox,
    GlobalUserRestrictionStub,
    ElasticIndexerStub,
    getGlobalUserRestrictionByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GlobalUserRestrictionStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getGlobalUserRestrictionByIdStub = sandbox
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

    ({ DbCreateGlobaluserrestrictionCommand, dbCreateGlobaluserrestriction } =
      proxyquire(
        "../../../../src/db-layer/main/globalUserRestriction/dbCreateGlobaluserrestriction",
        {
          models: { GlobalUserRestriction: GlobalUserRestrictionStub },
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          "./utils/getGlobalUserRestrictionById":
            getGlobalUserRestrictionByIdStub,
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
      const cmd = new DbCreateGlobaluserrestrictionCommand({});
      expect(cmd.commandName).to.equal("dbCreateGlobaluserrestriction");
      expect(cmd.objectName).to.equal("globalUserRestriction");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-adminops-service-dbevent-globaluserrestriction-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getGlobalUserRestrictionById and indexData", async () => {
      const cmd = new DbCreateGlobaluserrestrictionCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getGlobalUserRestrictionByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing globalUserRestriction if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockglobalUserRestriction = { update: updateStub, getData: () => ({ id: 2 }) };

      GlobalUserRestrictionStub.findOne = sandbox.stub().resolves(mockglobalUserRestriction);
      GlobalUserRestrictionStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateGlobaluserrestrictionCommand(input);
      await cmd.runDbCommand();

      expect(input.globalUserRestriction).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new globalUserRestriction if no unique match is found", async () => {
      GlobalUserRestrictionStub.findOne = sandbox.stub().resolves(null);
      GlobalUserRestrictionStub.findByPk = sandbox.stub().resolves(null);
      GlobalUserRestrictionStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateGlobaluserrestrictionCommand(input);
      await cmd.runDbCommand();

      expect(input.globalUserRestriction).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(GlobalUserRestrictionStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      GlobalUserRestrictionStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateGlobaluserrestrictionCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateGlobaluserrestriction", () => {
    it("should execute successfully and return dbData", async () => {
      GlobalUserRestrictionStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "globalUserRestriction" } };
      const result = await dbCreateGlobaluserrestriction(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
