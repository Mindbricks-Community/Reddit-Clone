const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbUpdateGdprexportrequestCommand is exported from main code

describe("DbUpdateGdprexportrequestCommand", () => {
  let DbUpdateGdprexportrequestCommand, dbUpdateGdprexportrequest;
  let sandbox,
    getGdprExportRequestByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    getGdprExportRequestByIdStub = sandbox
      .stub()
      .resolves({ id: 99, name: "Updated gdprExportRequest" });

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

    ({ DbUpdateGdprexportrequestCommand, dbUpdateGdprexportrequest } =
      proxyquire(
        "../../../../src/db-layer/main/gdprExportRequest/dbUpdateGdprexportrequest",
        {
          "./utils/getGdprExportRequestById": getGdprExportRequestByIdStub,
          "./query-cache-classes": {
            GdprExportRequestQueryCacheInvalidator: sandbox.stub(),
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
      const cmd = new DbUpdateGdprexportrequestCommand({
        GdprExportRequestId: 1,
      });
      expect(cmd.commandName).to.equal("dbUpdateGdprexportrequest");
      expect(cmd.objectName).to.equal("gdprExportRequest");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.isBulk).to.be.false;
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with dbData.id", async () => {
      const cmd = new DbUpdateGdprexportrequestCommand({
        session: "s",
        requestId: "r",
      });

      cmd.dbData = { id: 101 };
      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getGdprExportRequestByIdStub, 101);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().indexData, {
        id: 99,
        name: "Updated gdprExportRequest",
      });
    });
  });

  describe("buildIncludes", () => {
    it("should return [] includes", () => {
      const cmd = new DbUpdateGdprexportrequestCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });
    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbUpdateGdprexportrequestCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbUpdateGdprexportrequest", () => {
    it("should execute update successfully", async () => {
      const result = await dbUpdateGdprexportrequest({
        gdprExportRequestId: 99,
        session: "abc",
        requestId: "xyz",
      });

      expect(result).to.deep.equal({ id: 99 });
    });
  });
});
