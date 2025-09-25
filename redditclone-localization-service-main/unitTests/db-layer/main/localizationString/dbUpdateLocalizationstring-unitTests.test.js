const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbUpdateLocalizationstringCommand is exported from main code

describe("DbUpdateLocalizationstringCommand", () => {
  let DbUpdateLocalizationstringCommand, dbUpdateLocalizationstring;
  let sandbox,
    getLocalizationStringByIdStub,
    ElasticIndexerStub,
    BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    getLocalizationStringByIdStub = sandbox
      .stub()
      .resolves({ id: 99, name: "Updated localizationString" });

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    BaseCommandStub = class {
      constructor(input, model, instanceMode) {
        this.input = input;
        this.model = model;
        this.session = input.session;
        this.requestId = input.requestId;
        this.dbData = { id: input.id || 99 };
      }

      loadHookFunctions() {}
      initOwnership() {}
      createEntityCacher() {}
      async execute() {
        await this.createQueryCacheInvalidator?.();
        await this.createDbInstance?.();
        await this.indexDataToElastic?.();
        return this.dbData;
      }
    };

    ({ DbUpdateLocalizationstringCommand, dbUpdateLocalizationstring } =
      proxyquire(
        "../../../../src/db-layer/main/localizationString/dbUpdateLocalizationstring",
        {
          "./utils/getLocalizationStringById": getLocalizationStringByIdStub,
          "./query-cache-classes": {
            LocalizationStringQueryCacheInvalidator: sandbox.stub(),
          },
          serviceCommon: { ElasticIndexer: ElasticIndexerStub },
          dbCommand: {
            DBUpdateSequelizeCommand: BaseCommandStub,
          },
          common: {
            NotFoundError: class NotFoundError extends Error {
              constructor(msg) {
                super(msg);
                this.name = "NotFoundError";
              }
            },
          },
          models: {
            User: {},
          },
        },
      ));
  });

  afterEach(() => sandbox.restore());

  describe("constructor", () => {
    it("should set command metadata correctly", () => {
      const cmd = new DbUpdateLocalizationstringCommand({
        LocalizationStringId: 1,
      });
      expect(cmd.commandName).to.equal("dbUpdateLocalizationstring");
      expect(cmd.objectName).to.equal("localizationString");
      expect(cmd.serviceLabel).to.equal("redditclone-localization-service");
      expect(cmd.isBulk).to.be.false;
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with dbData.id", async () => {
      const cmd = new DbUpdateLocalizationstringCommand({
        session: "s",
        requestId: "r",
      });

      cmd.dbData = { id: 101 };
      await cmd.indexDataToElastic();

      sinon.assert.calledWith(getLocalizationStringByIdStub, 101);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().indexData, {
        id: 99,
        name: "Updated localizationString",
      });
    });
  });

  describe("buildIncludes", () => {
    it("should return [] includes", () => {
      const cmd = new DbUpdateLocalizationstringCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });
    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbUpdateLocalizationstringCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("dbUpdateLocalizationstring", () => {
    it("should execute update successfully", async () => {
      const result = await dbUpdateLocalizationstring({
        localizationStringId: 99,
        session: "abc",
        requestId: "xyz",
      });

      expect(result).to.deep.equal({ id: 99 });
    });
  });
});
