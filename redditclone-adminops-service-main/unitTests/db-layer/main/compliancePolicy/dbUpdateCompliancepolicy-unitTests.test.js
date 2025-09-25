const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbUpdateCompliancepolicyCommand is exported from main code

describe("DbUpdateCompliancepolicyCommand", () => {
  let DbUpdateCompliancepolicyCommand, dbUpdateCompliancepolicy;
  let sandbox, getCompliancePolicyByIdStub, ElasticIndexerStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    getCompliancePolicyByIdStub = sandbox
      .stub()
      .resolves({ id: 99, name: "Updated compliancePolicy" });

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dbData = { id: input.id || 99 };
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
      async execute() {
        await this.createQueryCacheInvalidator?.();
        await this.createDbInstance?.();
        await this.indexDataToElastic?.();
        return this.dbData;
      }
    };

    ({ DbUpdateCompliancepolicyCommand, dbUpdateCompliancepolicy } = proxyquire(
      "../../../../src/db-layer/main/compliancePolicy/dbUpdateCompliancepolicy",
      {
        "./utils/getCompliancePolicyById": getCompliancePolicyByIdStub,
        "./query-cache-classes": {
          CompliancePolicyQueryCacheInvalidator: sandbox.stub(),
        },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
        dbCommand: {
          DBUpdateSequelizeCommand: BaseCommandStub,
        },
        common: {
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
        },
        models: {
          User: {},
        },
      },
    ));
  });

  afterEach(() => sandbox.restore());

  describe("constructor", () => {
    it("should set command metadata correctly", () => {
      const cmd = new DbUpdateCompliancepolicyCommand({
        CompliancePolicyId: 1,
      });
      expect(cmd.commandName).to.equal("dbUpdateCompliancepolicy");
      expect(cmd.objectName).to.equal("compliancePolicy");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.isBulk).to.be.false;
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with dbData.id", async () => {
      const cmd = new DbUpdateCompliancepolicyCommand({
        session: "s",
        requestId: "r",
      });

      cmd.dbData = { id: 101 };
      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getCompliancePolicyByIdStub, 101);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().indexData, {
        id: 99,
        name: "Updated compliancePolicy",
      });
    });
  });

  describe("buildIncludes", () => {
    it("should return [] includes", () => {
      const cmd = new DbUpdateCompliancepolicyCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });
    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbUpdateCompliancepolicyCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbUpdateCompliancepolicy", () => {
    it("should execute update successfully", async () => {
      const result = await dbUpdateCompliancepolicy({
        compliancePolicyId: 99,
        session: "abc",
        requestId: "xyz",
      });

      expect(result).to.deep.equal({ id: 99 });
    });
  });
});
