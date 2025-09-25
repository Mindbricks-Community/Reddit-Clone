const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetAbuseinvestigationCommand is exported from main code

describe("DbGetAbuseinvestigationCommand", () => {
  let DbGetAbuseinvestigationCommand, dbGetAbuseinvestigation;
  let sandbox, AbuseInvestigationStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseInvestigationStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.abuseInvestigationId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetAbuseinvestigationCommand, dbGetAbuseinvestigation } = proxyquire(
      "../../../../src/db-layer/main/abuseInvestigation/dbGetAbuseinvestigation",
      {
        models: { AbuseInvestigation: AbuseInvestigationStub },
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
      const cmd = new DbGetAbuseinvestigationCommand({});
      expect(cmd.commandName).to.equal("dbGetAbuseinvestigation");
      expect(cmd.objectName).to.equal("abuseInvestigation");
      expect(cmd.serviceLabel).to.equal("redditclone-abuse-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call AbuseInvestigation.getCqrsJoins if exists", async () => {
      const cmd = new DbGetAbuseinvestigationCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(AbuseInvestigationStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete AbuseInvestigationStub.getCqrsJoins;
      const cmd = new DbGetAbuseinvestigationCommand({});
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
      const cmd = new DbGetAbuseinvestigationCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetAbuseinvestigationCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetAbuseinvestigation", () => {
    it("should execute dbGetAbuseinvestigation and return abuseInvestigation data", async () => {
      const result = await dbGetAbuseinvestigation({
        abuseInvestigationId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
