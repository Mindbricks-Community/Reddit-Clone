const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateAbusereportCommand is exported from main code
describe("DbCreateAbusereportCommand", () => {
  let DbCreateAbusereportCommand, dbCreateAbusereport;
  let sandbox,
    AbuseReportStub,
    ElasticIndexerStub,
    getAbuseReportByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseReportStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getAbuseReportByIdStub = sandbox
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

    ({ DbCreateAbusereportCommand, dbCreateAbusereport } = proxyquire(
      "../../../../src/db-layer/main/abuseReport/dbCreateAbusereport",
      {
        models: { AbuseReport: AbuseReportStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getAbuseReportById": getAbuseReportByIdStub,
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
      const cmd = new DbCreateAbusereportCommand({});
      expect(cmd.commandName).to.equal("dbCreateAbusereport");
      expect(cmd.objectName).to.equal("abuseReport");
      expect(cmd.serviceLabel).to.equal("redditclone-abuse-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-abuse-service-dbevent-abusereport-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getAbuseReportById and indexData", async () => {
      const cmd = new DbCreateAbusereportCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getAbuseReportByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing abuseReport if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockabuseReport = { update: updateStub, getData: () => ({ id: 2 }) };

      AbuseReportStub.findOne = sandbox.stub().resolves(mockabuseReport);
      AbuseReportStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          reportedUserId: "reportedUserId_value",
          
          postId: "postId_value",
          
          commentId: "commentId_value",
          
          reporterUserId: "reporterUserId_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateAbusereportCommand(input);
      await cmd.runDbCommand();

      expect(input.abuseReport).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new abuseReport if no unique match is found", async () => {
      AbuseReportStub.findOne = sandbox.stub().resolves(null);
      AbuseReportStub.findByPk = sandbox.stub().resolves(null);
      AbuseReportStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          reportedUserId: "reportedUserId_value",
          
          postId: "postId_value",
          
          commentId: "commentId_value",
          
          reporterUserId: "reporterUserId_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateAbusereportCommand(input);
      await cmd.runDbCommand();

      expect(input.abuseReport).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(AbuseReportStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      AbuseReportStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateAbusereportCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateAbusereport", () => {
    it("should execute successfully and return dbData", async () => {
      AbuseReportStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "abuseReport" } };
      const result = await dbCreateAbusereport(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
