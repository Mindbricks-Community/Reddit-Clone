const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCommunityPinnedById module", () => {
  let sandbox;
  let getCommunityPinnedById;
  let CommunityPinnedStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CommunityPinned" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityPinnedStub = {
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

    getCommunityPinnedById = proxyquire(
      "../../../../../src/db-layer/main/CommunityPinned/utils/getCommunityPinnedById",
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

  describe("getCommunityPinnedById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getCommunityPinnedById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CommunityPinnedStub.findOne);
      sinon.assert.calledWith(
        CommunityPinnedStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getCommunityPinnedById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CommunityPinnedStub.findAll);
      sinon.assert.calledWithMatch(CommunityPinnedStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      CommunityPinnedStub.findOne.resolves(null);
      const result = await getCommunityPinnedById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      CommunityPinnedStub.findAll.resolves([]);
      const result = await getCommunityPinnedById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      CommunityPinnedStub.findOne.rejects(new Error("DB failure"));
      try {
        await getCommunityPinnedById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityPinnedById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      CommunityPinnedStub.findAll.rejects(new Error("array failure"));
      try {
        await getCommunityPinnedById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityPinnedById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      CommunityPinnedStub.findOne.resolves({ getData: () => undefined });
      const result = await getCommunityPinnedById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      CommunityPinnedStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCommunityPinnedById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
