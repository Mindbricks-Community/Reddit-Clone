const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCommunityAggById module", () => {
  let sandbox;
  let getCommunityAggById;
  let CommunityStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Community" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getCommunityAggById = proxyquire(
      "../../../../../src/db-layer/main/Community/utils/getCommunityAggById",
      {
        models: { Community: CommunityStub },
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

  describe("getCommunityAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getCommunityAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CommunityStub.findOne);
      sinon.assert.calledOnce(CommunityStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getCommunityAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CommunityStub.findAll);
      sinon.assert.calledOnce(CommunityStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      CommunityStub.findOne.resolves(null);
      const result = await getCommunityAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      CommunityStub.findAll.resolves([]);
      const result = await getCommunityAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      CommunityStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCommunityAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      CommunityStub.findOne.resolves({ getData: () => undefined });
      const result = await getCommunityAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      CommunityStub.findOne.rejects(new Error("fail"));
      try {
        await getCommunityAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      CommunityStub.findAll.rejects(new Error("all fail"));
      try {
        await getCommunityAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      CommunityStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getCommunityAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
