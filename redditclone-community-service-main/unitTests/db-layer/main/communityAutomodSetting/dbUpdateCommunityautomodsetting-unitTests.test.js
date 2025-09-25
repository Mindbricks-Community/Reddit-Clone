const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbUpdateCommunityautomodsettingCommand is exported from main code

describe("DbUpdateCommunityautomodsettingCommand", () => {
  let DbUpdateCommunityautomodsettingCommand, dbUpdateCommunityautomodsetting;
  let sandbox,
    getCommunityAutomodSettingByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    getCommunityAutomodSettingByIdStub = sandbox
      .stub()
      .resolves({ id: 99, name: "Updated communityAutomodSetting" });

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

    ({
      DbUpdateCommunityautomodsettingCommand,
      dbUpdateCommunityautomodsetting,
    } = proxyquire(
      "../../../../src/db-layer/main/communityAutomodSetting/dbUpdateCommunityautomodsetting",
      {
        "./utils/getCommunityAutomodSettingById":
          getCommunityAutomodSettingByIdStub,
        "./query-cache-classes": {
          CommunityAutomodSettingQueryCacheInvalidator: sandbox.stub(),
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
      const cmd = new DbUpdateCommunityautomodsettingCommand({
        CommunityAutomodSettingId: 1,
      });
      expect(cmd.commandName).to.equal("dbUpdateCommunityautomodsetting");
      expect(cmd.objectName).to.equal("communityAutomodSetting");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.isBulk).to.be.false;
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with dbData.id", async () => {
      const cmd = new DbUpdateCommunityautomodsettingCommand({
        session: "s",
        requestId: "r",
      });

      cmd.dbData = { id: 101 };
      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getCommunityAutomodSettingByIdStub, 101);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().indexData, {
        id: 99,
        name: "Updated communityAutomodSetting",
      });
    });
  });

  describe("buildIncludes", () => {
    it("should return [] includes", () => {
      const cmd = new DbUpdateCommunityautomodsettingCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });
    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbUpdateCommunityautomodsettingCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbUpdateCommunityautomodsetting", () => {
    it("should execute update successfully", async () => {
      const result = await dbUpdateCommunityautomodsetting({
        communityAutomodSettingId: 99,
        session: "abc",
        requestId: "xyz",
      });

      expect(result).to.deep.equal({ id: 99 });
    });
  });
});
