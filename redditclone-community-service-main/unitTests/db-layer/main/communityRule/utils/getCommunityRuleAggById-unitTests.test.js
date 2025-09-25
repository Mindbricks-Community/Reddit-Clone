const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCommunityRuleAggById module", () => {
  let sandbox;
  let getCommunityRuleAggById;
  let CommunityRuleStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CommunityRule" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityRuleStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getCommunityRuleAggById = proxyquire(
      "../../../../../src/db-layer/main/CommunityRule/utils/getCommunityRuleAggById",
      {
        models: { CommunityRule: CommunityRuleStub },
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

  describe("getCommunityRuleAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getCommunityRuleAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CommunityRuleStub.findOne);
      sinon.assert.calledOnce(CommunityRuleStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getCommunityRuleAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CommunityRuleStub.findAll);
      sinon.assert.calledOnce(CommunityRuleStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      CommunityRuleStub.findOne.resolves(null);
      const result = await getCommunityRuleAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      CommunityRuleStub.findAll.resolves([]);
      const result = await getCommunityRuleAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      CommunityRuleStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCommunityRuleAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      CommunityRuleStub.findOne.resolves({ getData: () => undefined });
      const result = await getCommunityRuleAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      CommunityRuleStub.findOne.rejects(new Error("fail"));
      try {
        await getCommunityRuleAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityRuleAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      CommunityRuleStub.findAll.rejects(new Error("all fail"));
      try {
        await getCommunityRuleAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityRuleAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      CommunityRuleStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getCommunityRuleAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityRuleAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
