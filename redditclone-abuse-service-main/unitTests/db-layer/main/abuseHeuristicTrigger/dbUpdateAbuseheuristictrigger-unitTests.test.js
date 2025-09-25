const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbUpdateAbuseheuristictriggerCommand is exported from main code

describe("DbUpdateAbuseheuristictriggerCommand", () => {
  let DbUpdateAbuseheuristictriggerCommand, dbUpdateAbuseheuristictrigger;
  let sandbox,
    getAbuseHeuristicTriggerByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    getAbuseHeuristicTriggerByIdStub = sandbox
      .stub()
      .resolves({ id: 99, name: "Updated abuseHeuristicTrigger" });

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

    ({ DbUpdateAbuseheuristictriggerCommand, dbUpdateAbuseheuristictrigger } =
      proxyquire(
        "../../../../src/db-layer/main/abuseHeuristicTrigger/dbUpdateAbuseheuristictrigger",
        {
          "./utils/getAbuseHeuristicTriggerById":
            getAbuseHeuristicTriggerByIdStub,
          "./query-cache-classes": {
            AbuseHeuristicTriggerQueryCacheInvalidator: sandbox.stub(),
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
      const cmd = new DbUpdateAbuseheuristictriggerCommand({
        AbuseHeuristicTriggerId: 1,
      });
      expect(cmd.commandName).to.equal("dbUpdateAbuseheuristictrigger");
      expect(cmd.objectName).to.equal("abuseHeuristicTrigger");
      expect(cmd.serviceLabel).to.equal("redditclone-abuse-service");
      expect(cmd.isBulk).to.be.false;
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with dbData.id", async () => {
      const cmd = new DbUpdateAbuseheuristictriggerCommand({
        session: "s",
        requestId: "r",
      });

      cmd.dbData = { id: 101 };
      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getAbuseHeuristicTriggerByIdStub, 101);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().indexData, {
        id: 99,
        name: "Updated abuseHeuristicTrigger",
      });
    });
  });

  describe("buildIncludes", () => {
    it("should return [] includes", () => {
      const cmd = new DbUpdateAbuseheuristictriggerCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });
    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbUpdateAbuseheuristictriggerCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbUpdateAbuseheuristictrigger", () => {
    it("should execute update successfully", async () => {
      const result = await dbUpdateAbuseheuristictrigger({
        abuseHeuristicTriggerId: 99,
        session: "abc",
        requestId: "xyz",
      });

      expect(result).to.deep.equal({ id: 99 });
    });
  });
});
