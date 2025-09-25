const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetVoteCommand is exported from main code

describe("DbGetVoteCommand", () => {
  let DbGetVoteCommand, dbGetVote;
  let sandbox, VoteStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    VoteStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.voteId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetVoteCommand, dbGetVote } = proxyquire(
      "../../../../src/db-layer/main/vote/dbGetVote",
      {
        models: { Vote: VoteStub },
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
      const cmd = new DbGetVoteCommand({});
      expect(cmd.commandName).to.equal("dbGetVote");
      expect(cmd.objectName).to.equal("vote");
      expect(cmd.serviceLabel).to.equal("redditclone-content-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call Vote.getCqrsJoins if exists", async () => {
      const cmd = new DbGetVoteCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(VoteStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete VoteStub.getCqrsJoins;
      const cmd = new DbGetVoteCommand({});
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
      const cmd = new DbGetVoteCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetVoteCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetVote", () => {
    it("should execute dbGetVote and return vote data", async () => {
      const result = await dbGetVote({
        voteId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
