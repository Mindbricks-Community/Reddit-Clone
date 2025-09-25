const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetCommunitymemberCommand is exported from main code

describe("DbGetCommunitymemberCommand", () => {
  let DbGetCommunitymemberCommand, dbGetCommunitymember;
  let sandbox, CommunityMemberStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityMemberStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.communityMemberId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetCommunitymemberCommand, dbGetCommunitymember } = proxyquire(
      "../../../../src/db-layer/main/communityMember/dbGetCommunitymember",
      {
        models: { CommunityMember: CommunityMemberStub },
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
      const cmd = new DbGetCommunitymemberCommand({});
      expect(cmd.commandName).to.equal("dbGetCommunitymember");
      expect(cmd.objectName).to.equal("communityMember");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call CommunityMember.getCqrsJoins if exists", async () => {
      const cmd = new DbGetCommunitymemberCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(CommunityMemberStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete CommunityMemberStub.getCqrsJoins;
      const cmd = new DbGetCommunitymemberCommand({});
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
      const cmd = new DbGetCommunitymemberCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetCommunitymemberCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetCommunitymember", () => {
    it("should execute dbGetCommunitymember and return communityMember data", async () => {
      const result = await dbGetCommunitymember({
        communityMemberId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
