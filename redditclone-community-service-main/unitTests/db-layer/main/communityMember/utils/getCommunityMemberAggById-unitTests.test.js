const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCommunityMemberAggById module", () => {
  let sandbox;
  let getCommunityMemberAggById;
  let CommunityMemberStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CommunityMember" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityMemberStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getCommunityMemberAggById = proxyquire(
      "../../../../../src/db-layer/main/CommunityMember/utils/getCommunityMemberAggById",
      {
        models: { CommunityMember: CommunityMemberStub },
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

  describe("getCommunityMemberAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getCommunityMemberAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CommunityMemberStub.findOne);
      sinon.assert.calledOnce(CommunityMemberStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getCommunityMemberAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CommunityMemberStub.findAll);
      sinon.assert.calledOnce(CommunityMemberStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      CommunityMemberStub.findOne.resolves(null);
      const result = await getCommunityMemberAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      CommunityMemberStub.findAll.resolves([]);
      const result = await getCommunityMemberAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      CommunityMemberStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCommunityMemberAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      CommunityMemberStub.findOne.resolves({ getData: () => undefined });
      const result = await getCommunityMemberAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      CommunityMemberStub.findOne.rejects(new Error("fail"));
      try {
        await getCommunityMemberAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityMemberAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      CommunityMemberStub.findAll.rejects(new Error("all fail"));
      try {
        await getCommunityMemberAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityMemberAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      CommunityMemberStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getCommunityMemberAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityMemberAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
