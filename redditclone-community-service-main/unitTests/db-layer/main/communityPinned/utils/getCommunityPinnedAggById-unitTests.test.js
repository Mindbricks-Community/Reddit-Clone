const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCommunityPinnedAggById module", () => {
  let sandbox;
  let getCommunityPinnedAggById;
  let CommunityPinnedStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CommunityPinned" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityPinnedStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getCommunityPinnedAggById = proxyquire(
      "../../../../../src/db-layer/main/CommunityPinned/utils/getCommunityPinnedAggById",
      {
        models: { CommunityPinned: CommunityPinnedStub },
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

  describe("getCommunityPinnedAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getCommunityPinnedAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CommunityPinnedStub.findOne);
      sinon.assert.calledOnce(CommunityPinnedStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getCommunityPinnedAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CommunityPinnedStub.findAll);
      sinon.assert.calledOnce(CommunityPinnedStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      CommunityPinnedStub.findOne.resolves(null);
      const result = await getCommunityPinnedAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      CommunityPinnedStub.findAll.resolves([]);
      const result = await getCommunityPinnedAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      CommunityPinnedStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCommunityPinnedAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      CommunityPinnedStub.findOne.resolves({ getData: () => undefined });
      const result = await getCommunityPinnedAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      CommunityPinnedStub.findOne.rejects(new Error("fail"));
      try {
        await getCommunityPinnedAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityPinnedAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      CommunityPinnedStub.findAll.rejects(new Error("all fail"));
      try {
        await getCommunityPinnedAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityPinnedAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      CommunityPinnedStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getCommunityPinnedAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityPinnedAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
