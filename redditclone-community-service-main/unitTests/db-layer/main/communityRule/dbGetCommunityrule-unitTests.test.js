const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetCommunityruleCommand is exported from main code

describe("DbGetCommunityruleCommand", () => {
  let DbGetCommunityruleCommand, dbGetCommunityrule;
  let sandbox, CommunityRuleStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityRuleStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.communityRuleId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetCommunityruleCommand, dbGetCommunityrule } = proxyquire(
      "../../../../src/db-layer/main/communityRule/dbGetCommunityrule",
      {
        models: { CommunityRule: CommunityRuleStub },
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
      const cmd = new DbGetCommunityruleCommand({});
      expect(cmd.commandName).to.equal("dbGetCommunityrule");
      expect(cmd.objectName).to.equal("communityRule");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call CommunityRule.getCqrsJoins if exists", async () => {
      const cmd = new DbGetCommunityruleCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(CommunityRuleStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete CommunityRuleStub.getCqrsJoins;
      const cmd = new DbGetCommunityruleCommand({});
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
      const cmd = new DbGetCommunityruleCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetCommunityruleCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetCommunityrule", () => {
    it("should execute dbGetCommunityrule and return communityRule data", async () => {
      const result = await dbGetCommunityrule({
        communityRuleId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
