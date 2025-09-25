const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteCompliancepolicyCommand is exported from main code

describe("DbDeleteCompliancepolicyCommand", () => {
  let DbDeleteCompliancepolicyCommand, dbDeleteCompliancepolicy;
  let sandbox,
    CompliancePolicyStub,
    getCompliancePolicyByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CompliancePolicyStub = {};

    getCompliancePolicyByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.compliancePolicyId || 123 };
        this.dbInstance = null;
      }

      loadHookFunctions() {}
      initOwnership() {}
      async execute() {
        await this.createQueryCacheInvalidator?.();
        await this.createDbInstance?.();
        await this.indexDataToElastic?.();
        return this.dbData;
      }
    };

    ({ DbDeleteCompliancepolicyCommand, dbDeleteCompliancepolicy } = proxyquire(
      "../../../../src/db-layer/main/compliancePolicy/dbDeleteCompliancepolicy",
      {
        models: { CompliancePolicy: CompliancePolicyStub },
        "./query-cache-classes": {
          CompliancePolicyQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getCompliancePolicyById": getCompliancePolicyByIdStub,
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        dbCommand: {
          DBSoftDeleteSequelizeCommand: BaseCommandStub,
        },
        common: {
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
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
      const cmd = new DbDeleteCompliancepolicyCommand({});
      expect(cmd.commandName).to.equal("dbDeleteCompliancepolicy");
      expect(cmd.objectName).to.equal("compliancePolicy");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-adminops-service-dbevent-compliancepolicy-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteCompliancepolicyCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteCompliancepolicy", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getCompliancePolicyByIdStub.resolves(mockInstance);

      const input = {
        compliancePolicyId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteCompliancepolicy(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
