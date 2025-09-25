const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCommunityAutomodSettingAggById module", () => {
  let sandbox;
  let getCommunityAutomodSettingAggById;
  let CommunityAutomodSettingStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CommunityAutomodSetting" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityAutomodSettingStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getCommunityAutomodSettingAggById = proxyquire(
      "../../../../../src/db-layer/main/CommunityAutomodSetting/utils/getCommunityAutomodSettingAggById",
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

  describe("getCommunityAutomodSettingAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getCommunityAutomodSettingAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CommunityAutomodSettingStub.findOne);
      sinon.assert.calledOnce(CommunityAutomodSettingStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getCommunityAutomodSettingAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CommunityAutomodSettingStub.findAll);
      sinon.assert.calledOnce(CommunityAutomodSettingStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      CommunityAutomodSettingStub.findOne.resolves(null);
      const result = await getCommunityAutomodSettingAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      CommunityAutomodSettingStub.findAll.resolves([]);
      const result = await getCommunityAutomodSettingAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      CommunityAutomodSettingStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCommunityAutomodSettingAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      CommunityAutomodSettingStub.findOne.resolves({
        getData: () => undefined,
      });
      const result = await getCommunityAutomodSettingAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      CommunityAutomodSettingStub.findOne.rejects(new Error("fail"));
      try {
        await getCommunityAutomodSettingAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityAutomodSettingAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      CommunityAutomodSettingStub.findAll.rejects(new Error("all fail"));
      try {
        await getCommunityAutomodSettingAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityAutomodSettingAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      CommunityAutomodSettingStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getCommunityAutomodSettingAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityAutomodSettingAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
