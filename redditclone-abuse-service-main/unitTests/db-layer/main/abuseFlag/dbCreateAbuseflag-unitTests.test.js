const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateAbuseflagCommand is exported from main code
describe("DbCreateAbuseflagCommand", () => {
  let DbCreateAbuseflagCommand, dbCreateAbuseflag;
  let sandbox,
    AbuseFlagStub,
    ElasticIndexerStub,
    getAbuseFlagByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseFlagStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getAbuseFlagByIdStub = sandbox
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

    ({ DbCreateAbuseflagCommand, dbCreateAbuseflag } = proxyquire(
      "../../../../src/db-layer/main/abuseFlag/dbCreateAbuseflag",
      {
        models: { AbuseFlag: AbuseFlagStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getAbuseFlagById": getAbuseFlagByIdStub,
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
      const cmd = new DbCreateAbuseflagCommand({});
      expect(cmd.commandName).to.equal("dbCreateAbuseflag");
      expect(cmd.objectName).to.equal("abuseFlag");
      expect(cmd.serviceLabel).to.equal("redditclone-abuse-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-abuse-service-dbevent-abuseflag-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getAbuseFlagById and indexData", async () => {
      const cmd = new DbCreateAbuseflagCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getAbuseFlagByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing abuseFlag if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockabuseFlag = { update: updateStub, getData: () => ({ id: 2 }) };

      AbuseFlagStub.findOne = sandbox.stub().resolves(mockabuseFlag);
      AbuseFlagStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          flagType: "flagType_value",
          
          postId: "postId_value",
          
          commentId: "commentId_value",
          
          userId: "userId_value",
          
          mediaObjectId: "mediaObjectId_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateAbuseflagCommand(input);
      await cmd.runDbCommand();

      expect(input.abuseFlag).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new abuseFlag if no unique match is found", async () => {
      AbuseFlagStub.findOne = sandbox.stub().resolves(null);
      AbuseFlagStub.findByPk = sandbox.stub().resolves(null);
      AbuseFlagStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          flagType: "flagType_value",
          
          postId: "postId_value",
          
          commentId: "commentId_value",
          
          userId: "userId_value",
          
          mediaObjectId: "mediaObjectId_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateAbuseflagCommand(input);
      await cmd.runDbCommand();

      expect(input.abuseFlag).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(AbuseFlagStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      AbuseFlagStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateAbuseflagCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateAbuseflag", () => {
    it("should execute successfully and return dbData", async () => {
      AbuseFlagStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "abuseFlag" } };
      const result = await dbCreateAbuseflag(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
