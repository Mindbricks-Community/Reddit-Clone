const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetAbusereportCommand is exported from main code

describe("DbGetAbusereportCommand", () => {
  let DbGetAbusereportCommand, dbGetAbusereport;
  let sandbox, AbuseReportStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseReportStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.abuseReportId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetAbusereportCommand, dbGetAbusereport } = proxyquire(
      "../../../../src/db-layer/main/abuseReport/dbGetAbusereport",
      {
        models: { AbuseReport: AbuseReportStub },
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
      const cmd = new DbGetAbusereportCommand({});
      expect(cmd.commandName).to.equal("dbGetAbusereport");
      expect(cmd.objectName).to.equal("abuseReport");
      expect(cmd.serviceLabel).to.equal("redditclone-abuse-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call AbuseReport.getCqrsJoins if exists", async () => {
      const cmd = new DbGetAbusereportCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(AbuseReportStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete AbuseReportStub.getCqrsJoins;
      const cmd = new DbGetAbusereportCommand({});
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
      const cmd = new DbGetAbusereportCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetAbusereportCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetAbusereport", () => {
    it("should execute dbGetAbusereport and return abuseReport data", async () => {
      const result = await dbGetAbusereport({
        abuseReportId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
