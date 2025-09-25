const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetCommunityautomodsettingCommand is exported from main code

describe("DbGetCommunityautomodsettingCommand", () => {
  let DbGetCommunityautomodsettingCommand, dbGetCommunityautomodsetting;
  let sandbox, CommunityAutomodSettingStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityAutomodSettingStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.communityAutomodSettingId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetCommunityautomodsettingCommand, dbGetCommunityautomodsetting } =
      proxyquire(
        "../../../../src/db-layer/main/communityAutomodSetting/dbGetCommunityautomodsetting",
        {
          models: { CommunityAutomodSetting: CommunityAutomodSettingStub },
          dbCommand: {
            DBGetSequelizeCommand: BaseCommandStub,
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
    it("should set command metadata correctly", () => {
      const cmd = new DbGetCommunityautomodsettingCommand({});
      expect(cmd.commandName).to.equal("dbGetCommunityautomodsetting");
      expect(cmd.objectName).to.equal("communityAutomodSetting");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call CommunityAutomodSetting.getCqrsJoins if exists", async () => {
      const cmd = new DbGetCommunityautomodsettingCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(CommunityAutomodSettingStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete CommunityAutomodSettingStub.getCqrsJoins;
      const cmd = new DbGetCommunityautomodsettingCommand({});
      let errorThrown = false;
      try {
        await cmd.getCqrsJoins({});
      } catch (err) {
        errorThrown = true;
      }

      expect(errorThrown).to.be.false;
    });
  });

  describe("buildIncludes", () => {
    it("should return [] includes", () => {
      const cmd = new DbGetCommunityautomodsettingCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetCommunityautomodsettingCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetCommunityautomodsetting", () => {
    it("should execute dbGetCommunityautomodsetting and return communityAutomodSetting data", async () => {
      const result = await dbGetCommunityautomodsetting({
        communityAutomodSettingId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
