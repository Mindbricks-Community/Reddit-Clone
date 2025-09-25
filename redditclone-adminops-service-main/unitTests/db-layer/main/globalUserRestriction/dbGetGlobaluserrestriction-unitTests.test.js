const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetGlobaluserrestrictionCommand is exported from main code

describe("DbGetGlobaluserrestrictionCommand", () => {
  let DbGetGlobaluserrestrictionCommand, dbGetGlobaluserrestriction;
  let sandbox, GlobalUserRestrictionStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GlobalUserRestrictionStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.globalUserRestrictionId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetGlobaluserrestrictionCommand, dbGetGlobaluserrestriction } =
      proxyquire(
        "../../../../src/db-layer/main/globalUserRestriction/dbGetGlobaluserrestriction",
        {
          models: { GlobalUserRestriction: GlobalUserRestrictionStub },
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
      const cmd = new DbGetGlobaluserrestrictionCommand({});
      expect(cmd.commandName).to.equal("dbGetGlobaluserrestriction");
      expect(cmd.objectName).to.equal("globalUserRestriction");
      expect(cmd.serviceLabel).to.equal("redditclone-adminops-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call GlobalUserRestriction.getCqrsJoins if exists", async () => {
      const cmd = new DbGetGlobaluserrestrictionCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(GlobalUserRestrictionStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete GlobalUserRestrictionStub.getCqrsJoins;
      const cmd = new DbGetGlobaluserrestrictionCommand({});
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
      const cmd = new DbGetGlobaluserrestrictionCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetGlobaluserrestrictionCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetGlobaluserrestriction", () => {
    it("should execute dbGetGlobaluserrestriction and return globalUserRestriction data", async () => {
      const result = await dbGetGlobaluserrestriction({
        globalUserRestrictionId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
