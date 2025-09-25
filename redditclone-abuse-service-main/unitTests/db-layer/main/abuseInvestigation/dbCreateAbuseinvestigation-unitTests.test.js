const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateAbuseinvestigationCommand is exported from main code
describe("DbCreateAbuseinvestigationCommand", () => {
  let DbCreateAbuseinvestigationCommand, dbCreateAbuseinvestigation;
  let sandbox,
    AbuseInvestigationStub,
    ElasticIndexerStub,
    getAbuseInvestigationByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseInvestigationStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getAbuseInvestigationByIdStub = sandbox
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

    ({ DbCreateAbuseinvestigationCommand, dbCreateAbuseinvestigation } =
      proxyquire(
        "../../../../src/db-layer/main/abuseInvestigation/dbCreateAbuseinvestigation",
        {
          models: { AbuseInvestigation: AbuseInvestigationStub },
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          "./utils/getAbuseInvestigationById": getAbuseInvestigationByIdStub,
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
      const cmd = new DbCreateAbuseinvestigationCommand({});
      expect(cmd.commandName).to.equal("dbCreateAbuseinvestigation");
      expect(cmd.objectName).to.equal("abuseInvestigation");
      expect(cmd.serviceLabel).to.equal("redditclone-abuse-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-abuse-service-dbevent-abuseinvestigation-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getAbuseInvestigationById and indexData", async () => {
      const cmd = new DbCreateAbuseinvestigationCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getAbuseInvestigationByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing abuseInvestigation if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockabuseInvestigation = { update: updateStub, getData: () => ({ id: 2 }) };

      AbuseInvestigationStub.findOne = sandbox.stub().resolves(mockabuseInvestigation);
      AbuseInvestigationStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          openedByUserId: "openedByUserId_value",
          
          investigationStatus: "investigationStatus_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateAbuseinvestigationCommand(input);
      await cmd.runDbCommand();

      expect(input.abuseInvestigation).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new abuseInvestigation if no unique match is found", async () => {
      AbuseInvestigationStub.findOne = sandbox.stub().resolves(null);
      AbuseInvestigationStub.findByPk = sandbox.stub().resolves(null);
      AbuseInvestigationStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          openedByUserId: "openedByUserId_value",
          
          investigationStatus: "investigationStatus_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateAbuseinvestigationCommand(input);
      await cmd.runDbCommand();

      expect(input.abuseInvestigation).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(AbuseInvestigationStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      AbuseInvestigationStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateAbuseinvestigationCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateAbuseinvestigation", () => {
    it("should execute successfully and return dbData", async () => {
      AbuseInvestigationStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "abuseInvestigation" } };
      const result = await dbCreateAbuseinvestigation(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
