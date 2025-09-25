const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbCreateCompliancepolicyCommand is exported from main code
describe("DbCreateCompliancepolicyCommand", () => {
  let DbCreateCompliancepolicyCommand, dbCreateCompliancepolicy;
  let sandbox,
    CompliancePolicyStub,
    ElasticIndexerStub,
    getCompliancePolicyByIdStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CompliancePolicyStub = {
      findByPk: sandbox.stub(),
      create: sandbox.stub(),
    };

    getCompliancePolicyByIdStub = sandbox
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

    ({ DbCreateCompliancepolicyCommand, dbCreateCompliancepolicy } = proxyquire(
      "../../../../src/db-layer/main/compliancePolicy/dbCreateCompliancepolicy",
      {
        models: { CompliancePolicy: CompliancePolicyStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        "./utils/getCompliancePolicyById": getCompliancePolicyByIdStub,
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
      const cmd = new DbCreateCompliancepolicyCommand({});
      expect(cmd.commandName).to.equal("dbCreateCompliancepolicy");
      expect(cmd.objectName).to.equal("compliancePolicy");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-adminops-service-dbevent-compliancepolicy-created",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call getCompliancePolicyById and indexData", async () => {
      const cmd = new DbCreateCompliancepolicyCommand({
        session: "session-id",
        requestId: "req-123",
      });
      cmd.dbData = { id: 1 };

      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getCompliancePolicyByIdStub, 1);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });
  });

  /* describe("runDbCommand", () => {
    

    it("should update existing compliancePolicy if found by unique index", async () => {
      const updateStub = sandbox.stub().resolves();
      const mockcompliancePolicy = { update: updateStub, getData: () => ({ id: 2 }) };

      CompliancePolicyStub.findOne = sandbox.stub().resolves(mockcompliancePolicy);
      CompliancePolicyStub.findByPk = sandbox.stub().resolves(null);

      const input = {
        dataClause: {
          
          id: "id_value",
          
          name: "updated"
        },
        checkoutResult: {}
      };

      const cmd = new DbCreateCompliancepolicyCommand(input);
      await cmd.runDbCommand();

      expect(input.compliancePolicy).to.deep.equal({ id: 2 });
      sinon.assert.calledOnce(updateStub);
    });

    it("should create new compliancePolicy if no unique match is found", async () => {
      CompliancePolicyStub.findOne = sandbox.stub().resolves(null);
      CompliancePolicyStub.findByPk = sandbox.stub().resolves(null);
      CompliancePolicyStub.create.resolves({
        getData: () => ({ id: 5, name: "new" }),
      });

      const input = {
        dataClause: {
          
          name: "name_value",
          
          name: "new"
        }
      };

      const cmd = new DbCreateCompliancepolicyCommand(input);
      await cmd.runDbCommand();

      expect(input.compliancePolicy).to.deep.equal({ id: 5, name: "new" });
      sinon.assert.calledOnce(CompliancePolicyStub.create);
    });

    it("should throw HttpServerError on Sequelize update failure", async () => {
      CompliancePolicyStub.findByPk.rejects(new Error("Update failed"));

      const input = {
        dataClause: { id: 3 },
        checkoutResult: {},
      };

      const cmd = new DbCreateCompliancepolicyCommand(input);

      try {
        await cmd.runDbCommand();
        throw new Error("Should have thrown");
      } catch (err) {
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.include("Error in checking unique index");
      }
    });
  });*/ //// go back to fix

  describe("dbCreateCompliancepolicy", () => {
    it("should execute successfully and return dbData", async () => {
      CompliancePolicyStub.create.resolves({ getData: () => ({ id: 9 }) });

      const input = { dataClause: { name: "compliancePolicy" } };
      const result = await dbCreateCompliancepolicy(input);

      expect(result).to.deep.equal({ id: 9 });
    });
  });
});
