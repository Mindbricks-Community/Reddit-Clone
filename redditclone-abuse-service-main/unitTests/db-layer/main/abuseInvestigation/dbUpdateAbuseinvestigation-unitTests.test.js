const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbUpdateAbuseinvestigationCommand is exported from main code

describe("DbUpdateAbuseinvestigationCommand", () => {
  let DbUpdateAbuseinvestigationCommand, dbUpdateAbuseinvestigation;
  let sandbox,
    getAbuseInvestigationByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    getAbuseInvestigationByIdStub = sandbox
      .stub()
      .resolves({ id: 99, name: "Updated abuseInvestigation" });

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

    ({ DbUpdateAbuseinvestigationCommand, dbUpdateAbuseinvestigation } =
      proxyquire(
        "../../../../src/db-layer/main/abuseInvestigation/dbUpdateAbuseinvestigation",
        {
          "./utils/getAbuseInvestigationById": getAbuseInvestigationByIdStub,
          "./query-cache-classes": {
            AbuseInvestigationQueryCacheInvalidator: sandbox.stub(),
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
      const cmd = new DbUpdateAbuseinvestigationCommand({
        AbuseInvestigationId: 1,
      });
      expect(cmd.commandName).to.equal("dbUpdateAbuseinvestigation");
      expect(cmd.objectName).to.equal("abuseInvestigation");
      expect(cmd.serviceLabel).to.equal("redditclone-abuse-service");
      expect(cmd.isBulk).to.be.false;
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with dbData.id", async () => {
      const cmd = new DbUpdateAbuseinvestigationCommand({
        session: "s",
        requestId: "r",
      });

      cmd.dbData = { id: 101 };
      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getAbuseInvestigationByIdStub, 101);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().indexData, {
        id: 99,
        name: "Updated abuseInvestigation",
      });
    });
  });

  describe("buildIncludes", () => {
    it("should return [] includes", () => {
      const cmd = new DbUpdateAbuseinvestigationCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });
    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbUpdateAbuseinvestigationCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbUpdateAbuseinvestigation", () => {
    it("should execute update successfully", async () => {
      const result = await dbUpdateAbuseinvestigation({
        abuseInvestigationId: 99,
        session: "abc",
        requestId: "xyz",
      });

      expect(result).to.deep.equal({ id: 99 });
    });
  });
});
