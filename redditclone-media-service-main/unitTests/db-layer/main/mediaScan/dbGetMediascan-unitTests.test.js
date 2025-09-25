const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetMediascanCommand is exported from main code

describe("DbGetMediascanCommand", () => {
  let DbGetMediascanCommand, dbGetMediascan;
  let sandbox, MediaScanStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaScanStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.mediaScanId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetMediascanCommand, dbGetMediascan } = proxyquire(
      "../../../../src/db-layer/main/mediaScan/dbGetMediascan",
      {
        models: { MediaScan: MediaScanStub },
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
      const cmd = new DbGetMediascanCommand({});
      expect(cmd.commandName).to.equal("dbGetMediascan");
      expect(cmd.objectName).to.equal("mediaScan");
      expect(cmd.serviceLabel).to.equal("redditclone-media-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call MediaScan.getCqrsJoins if exists", async () => {
      const cmd = new DbGetMediascanCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(MediaScanStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete MediaScanStub.getCqrsJoins;
      const cmd = new DbGetMediascanCommand({});
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
      const cmd = new DbGetMediascanCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetMediascanCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetMediascan", () => {
    it("should execute dbGetMediascan and return mediaScan data", async () => {
      const result = await dbGetMediascan({
        mediaScanId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
