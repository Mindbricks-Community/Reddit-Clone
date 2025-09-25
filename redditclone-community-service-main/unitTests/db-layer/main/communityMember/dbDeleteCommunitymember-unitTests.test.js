const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbDeleteCommunitymemberCommand is exported from main code

describe("DbDeleteCommunitymemberCommand", () => {
  let DbDeleteCommunitymemberCommand, dbDeleteCommunitymember;
  let sandbox,
    CommunityMemberStub,
    getCommunityMemberByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityMemberStub = {};

    getCommunityMemberByIdStub = sandbox.stub();

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.communityMemberId || 123 };
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

    ({ DbDeleteCommunitymemberCommand, dbDeleteCommunitymember } = proxyquire(
      "../../../../src/db-layer/main/communityMember/dbDeleteCommunitymember",
      {
        models: { CommunityMember: CommunityMemberStub },
        "./query-cache-classes": {
          CommunityMemberQueryCacheInvalidator: sandbox.stub(),
        },
        "./utils/getCommunityMemberById": getCommunityMemberByIdStub,
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
      const cmd = new DbDeleteCommunitymemberCommand({});
      expect(cmd.commandName).to.equal("dbDeleteCommunitymember");
      expect(cmd.objectName).to.equal("communityMember");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.dbEvent).to.equal(
        "redditclone-community-service-dbevent-communitymember-deleted",
      );
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer.deleteData with dbData.id", async () => {
      const cmd = new DbDeleteCommunitymemberCommand({
        session: "sess",
        requestId: "req-1",
      });
      cmd.dbData = { id: 42 };

      await cmd.indexDataToElastic();

      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, 42);
    });
  });

  describe("dbDeleteCommunitymember", () => {
    it("should execute deletion command successfully", async () => {
      const mockInstance = { id: 10 };
      getCommunityMemberByIdStub.resolves(mockInstance);

      const input = {
        communityMemberId: 10,
        session: "s",
        requestId: "r",
      };

      const result = await dbDeleteCommunitymember(input);

      expect(result).to.deep.equal({ id: 10 });
    });
  });
  ////syncJoins() tests will be added here
});
