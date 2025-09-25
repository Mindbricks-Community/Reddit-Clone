const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteModerationactionCommand is exported from main code

describe("DbDeleteModerationactionCommand", () => {
  let DbDeleteModerationactionCommand, dbDeleteModerationaction;
  let sandbox,
    ModerationActionStub,
    getModerationActionByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationActionStub = {};

    getModerationActionByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.moderationActionId || 123 };
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

    ({ DbDeleteModerationactionCommand, dbDeleteModerationaction } = proxyquire(
      "../../../../src/db-layer/main/moderationAction/dbDeleteModerationaction",
      {
        models: { ModerationAction: ModerationActionStub },
        "./query-cache-classes": {
          ModerationActionQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getModerationActionById": getModerationActionByIdStub,
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
      const cmd = new DbDeleteModerationactionCommand({});
      expect(cmd.commandName).to.equal("dbDeleteModerationaction");
      expect(cmd.objectName).to.equal("moderationAction");
      expect(cmd.serviceLabel).to.equal("redditclone-moderation-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-moderation-service-dbevent-moderationaction-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteModerationactionCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteModerationaction", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getModerationActionByIdStub.resolves(mockInstance);

      const input = {
        moderationActionId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteModerationaction(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
