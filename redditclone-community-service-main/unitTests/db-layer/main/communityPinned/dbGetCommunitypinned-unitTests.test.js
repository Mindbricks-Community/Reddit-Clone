const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetCommunitypinnedCommand is exported from main code

describe("DbGetCommunitypinnedCommand", () => {
  let DbGetCommunitypinnedCommand, dbGetCommunitypinned;
  let sandbox, CommunityPinnedStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityPinnedStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.communityPinnedId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetCommunitypinnedCommand, dbGetCommunitypinned } = proxyquire(
      "../../../../src/db-layer/main/communityPinned/dbGetCommunitypinned",
      {
        models: { CommunityPinned: CommunityPinnedStub },
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
      const cmd = new DbGetCommunitypinnedCommand({});
      expect(cmd.commandName).to.equal("dbGetCommunitypinned");
      expect(cmd.objectName).to.equal("communityPinned");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call CommunityPinned.getCqrsJoins if exists", async () => {
      const cmd = new DbGetCommunitypinnedCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(CommunityPinnedStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete CommunityPinnedStub.getCqrsJoins;
      const cmd = new DbGetCommunitypinnedCommand({});
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
      const cmd = new DbGetCommunitypinnedCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetCommunitypinnedCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetCommunitypinned", () => {
    it("should execute dbGetCommunitypinned and return communityPinned data", async () => {
      const result = await dbGetCommunitypinned({
        communityPinnedId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
