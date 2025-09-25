const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCommunityAutomodSettingById module", () => {
  let sandbox;
  let getCommunityAutomodSettingById;
  let CommunityAutomodSettingStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CommunityAutomodSetting" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityAutomodSettingStub = {
      findOne: sandbox.stub().resolves({
        getData: () => fakeData,
      }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
    };

    getCommunityAutomodSettingById = proxyquire(
      "../../../../../src/db-layer/main/CommunityAutomodSetting/utils/getCommunityAutomodSettingById",
      {
        models: { CommunityAutomodSetting: CommunityAutomodSettingStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(msg, details) {
              super(msg);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getCommunityAutomodSettingById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getCommunityAutomodSettingById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CommunityAutomodSettingStub.findOne);
      sinon.assert.calledWith(
        CommunityAutomodSettingStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getCommunityAutomodSettingById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CommunityAutomodSettingStub.findAll);
      sinon.assert.calledWithMatch(CommunityAutomodSettingStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      CommunityAutomodSettingStub.findOne.resolves(null);
      const result = await getCommunityAutomodSettingById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      CommunityAutomodSettingStub.findAll.resolves([]);
      const result = await getCommunityAutomodSettingById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      CommunityAutomodSettingStub.findOne.rejects(new Error("DB failure"));
      try {
        await getCommunityAutomodSettingById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityAutomodSettingById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      CommunityAutomodSettingStub.findAll.rejects(new Error("array failure"));
      try {
        await getCommunityAutomodSettingById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityAutomodSettingById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      CommunityAutomodSettingStub.findOne.resolves({
        getData: () => undefined,
      });
      const result = await getCommunityAutomodSettingById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      CommunityAutomodSettingStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCommunityAutomodSettingById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
