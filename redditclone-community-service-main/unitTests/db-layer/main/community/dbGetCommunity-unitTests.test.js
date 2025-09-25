const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetCommunityCommand is exported from main code

describe("DbGetCommunityCommand", () => {
  let DbGetCommunityCommand, dbGetCommunity;
  let sandbox, CommunityStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.communityId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetCommunityCommand, dbGetCommunity } = proxyquire(
      "../../../../src/db-layer/main/community/dbGetCommunity",
      {
        models: { Community: CommunityStub },
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
      const cmd = new DbGetCommunityCommand({});
      expect(cmd.commandName).to.equal("dbGetCommunity");
      expect(cmd.objectName).to.equal("community");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call Community.getCqrsJoins if exists", async () => {
      const cmd = new DbGetCommunityCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(CommunityStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete CommunityStub.getCqrsJoins;
      const cmd = new DbGetCommunityCommand({});
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
      const cmd = new DbGetCommunityCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetCommunityCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetCommunity", () => {
    it("should execute dbGetCommunity and return community data", async () => {
      const result = await dbGetCommunity({
        communityId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
