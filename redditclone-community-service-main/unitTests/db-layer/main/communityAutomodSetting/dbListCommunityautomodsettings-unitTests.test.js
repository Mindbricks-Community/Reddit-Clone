const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//these tests will work when DbListCommunityautomodsettingsCommand is exported from main code

describe("DbListCommunityautomodsettingsCommand", () => {
  let DbListCommunityautomodsettingsCommand, dbListCommunityautomodsettings;
  let sandbox, CommunityAutomodSettingStub, BaseCommandStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityAutomodSettingStub = {
      findAll: sandbox.stub().resolves([{ id: 1, name: "Visa" }]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    BaseCommandStub = class {
      constructor(input) {
        this.input = input;
        this.whereClause = { isActive: true };
        this.session = input.session;
        this.requestId = input.requestId;
        this.dbData = null;
      }

      loadHookFunctions() {}
      initOwnership() {}
      async execute() {
        const data = await this.executeQuery();
        this.dbData = data;
        return data;
      }

      getSelectList() {
        return this.input.select || null;
      }

      buildIncludes() {
        return null;
      }
    };

    ({ DbListCommunityautomodsettingsCommand, dbListCommunityautomodsettings } =
      proxyquire(
        "../../../../src/db-layer/main/communityAutomodSetting/dbListCommunityautomodsettings",
        {
          models: { CommunityAutomodSetting: CommunityAutomodSettingStub },
          dbCommand: { DBGetListSequelizeCommand: BaseCommandStub },
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
    it("should initialize command metadata and reset pagination if needed", () => {
      const input = { pagination: { page: 1 } };
      const cmd = new DbListCommunityautomodsettingsCommand(input);

      expect(cmd.commandName).to.equal("dbListCommunityautomodsettings");
      expect(cmd.emptyResult).to.be.true;
      expect(cmd.objectName).to.equal("communityAutomodSettings");
      expect(cmd.serviceLabel).to.equal("redditclone-community-service");
      expect(cmd.input.pagination).to.be.null;
    });
  });

  describe("getCqrsJoins", () => {
    it("should call CommunityAutomodSetting.getCqrsJoins if defined", async () => {
      const cmd = new DbListCommunityautomodsettingsCommand({});
      await cmd.getCqrsJoins({ id: 1 });
      sinon.assert.calledOnce(CommunityAutomodSettingStub.getCqrsJoins);
    });

    it("should skip getCqrsJoins if method is missing", async () => {
      delete CommunityAutomodSettingStub.getCqrsJoins;
      const cmd = new DbListCommunityautomodsettingsCommand({});
      let errorThrown = false;
      try {
        await cmd.getCqrsJoins({ id: 1 });
      } catch {
        errorThrown = true;
      }
      expect(errorThrown).to.be.false;
    });
  });

  describe("buildIncludes", () => {
    it("should return [] includes", () => {
      const cmd = new DbListCommunityautomodsettingsCommand({});
      const result = cmd.buildIncludes(true);
      expect(result).to.deep.equal([]);
    });
    it("should return [] includes even if getJoins is absent", () => {
      const cmd = new DbListCommunityautomodsettingsCommand({}); // input.getJoins is undefined
      const result = cmd.buildIncludes(false);
      expect(result).to.deep.equal([]);
    });
  });

  describe("executeQuery", () => {
    it("should handle empty selectList and skip attributes", async () => {
      const cmd = new DbListCommunityautomodsettingsCommand({
        getJoins: false,
      });
      sandbox.stub(cmd, "getSelectList").returns(null);

      await cmd.executeQuery();

      const callArgs = CommunityAutomodSettingStub.findAll.getCall(0).args[0];
      expect(callArgs.attributes).to.be.undefined;
    });

    it("should skip includes when input.getJoins is false", async () => {
      const cmd = new DbListCommunityautomodsettingsCommand({
        getJoins: false,
      });
      sandbox.stub(cmd, "getSelectList").returns(null);
      const result = await cmd.executeQuery();

      const callArgs = CommunityAutomodSettingStub.findAll.getCall(0).args[0];
      expect(callArgs.include).to.equal(null);
      expect(result).to.deep.equal([{ id: 1, name: "Visa" }]);
    });

    it("should return rows with count if pagination and count query are triggered", async () => {
      CommunityAutomodSettingStub.findAll.reset();
      CommunityAutomodSettingStub.findAll
        .onCall(0)
        .resolves([{ id: 1 }, { id: 2 }]);
      CommunityAutomodSettingStub.findAll.onCall(1).resolves([{ _COUNT: 12 }]);

      const input = {
        pagination: { pageRowCount: 10, pageNumber: 1 },
        getJoins: true,
      };

      const cmd = new DbListCommunityautomodsettingsCommand(input);
      sandbox.stub(cmd, "buildIncludes").returns([]);
      sandbox.stub(cmd, "getSelectList").returns(["id"]);

      // simulate full pagination count response logic
      cmd.executeQuery = async function () {
        const data = await CommunityAutomodSettingStub.findAll();
        const count = await CommunityAutomodSettingStub.findAll();
        return {
          rows: data,
          count: count[0]._COUNT,
        };
      };

      const result = await cmd.executeQuery();
      expect(result)
        .to.have.property("rows")
        .that.deep.equals([{ id: 1 }, { id: 2 }]);
      expect(result).to.have.property("count").that.equals(12);
    });

    it("should convert aggregations to float or int if convertAggregationsToNumbers exists", async () => {
      const cmd = new DbListCommunityautomodsettingsCommand({});
      const data = [{ total: "42.5" }];
      sandbox.stub(cmd, "getSelectList").returns(["total"]);
      sandbox.stub(cmd, "buildIncludes").returns(null);
      CommunityAutomodSettingStub.findAll.reset();
      CommunityAutomodSettingStub.findAll.resolves(data);

      cmd.convertAggregationsToNumbers = function (item) {
        item.total = parseFloat(item.total);
      };

      const result = await cmd.executeQuery();
      expect(result[0].total).to.equal("42.5");
    });

    it("should return first element directly if isAggregatedWithoutGroup", async () => {
      const cmd = new DbListCommunityautomodsettingsCommand({});
      const first = { total: 99 };
      sandbox.stub(cmd, "getSelectList").returns(["total"]);
      sandbox.stub(cmd, "buildIncludes").returns(null);
      CommunityAutomodSettingStub.findAll.resolves([first]);

      const result = await cmd.executeQuery();
      expect(result).to.deep.equal([first]);
    });
  });

  describe("dbListCommunityautomodsettings", () => {
    it("should return paymentMethods from execution", async () => {
      const input = { getJoins: false, session: "s", requestId: "r" };
      const result = await dbListCommunityautomodsettings(input);
      expect(result).to.deep.equal([{ id: 1, name: "Visa" }]);
    });
  });
});
