const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbGetMediaobjectCommand is exported from main code

describe("DbGetMediaobjectCommand", () => {
  let DbGetMediaobjectCommand, dbGetMediaobject;
  let sandbox, MediaObjectStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaObjectStub = {
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input, model) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dataClause = input.dataClause || {};
        this.dbData = { id: input.mediaObjectId || 101 };
      }

      async execute() {
        return this.dbData;
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
    };

    ({ DbGetMediaobjectCommand, dbGetMediaobject } = proxyquire(
      "../../../../src/db-layer/main/mediaObject/dbGetMediaobject",
      {
        models: { MediaObject: MediaObjectStub },
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
      const cmd = new DbGetMediaobjectCommand({});
      expect(cmd.commandName).to.equal("dbGetMediaobject");
      expect(cmd.objectName).to.equal("mediaObject");
      expect(cmd.serviceLabel).to.equal("redditclone-media-service");
      expect(cmd.nullResult).to.be.false;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call MediaObject.getCqrsJoins if exists", async () => {
      const cmd = new DbGetMediaobjectCommand({});
      await cmd.getCqrsJoins({ test: true });
      sinon.assert.calledOnce(MediaObjectStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete MediaObjectStub.getCqrsJoins;
      const cmd = new DbGetMediaobjectCommand({});
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
      const cmd = new DbGetMediaobjectCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });

    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbGetMediaobjectCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbGetMediaobject", () => {
    it("should execute dbGetMediaobject and return mediaObject data", async () => {
      const result = await dbGetMediaobject({
        mediaObjectId: 777,
        session: "sess",
        requestId: "req",
      });

      expect(result).to.deep.equal({ id: 777 });
    });
  });
});
