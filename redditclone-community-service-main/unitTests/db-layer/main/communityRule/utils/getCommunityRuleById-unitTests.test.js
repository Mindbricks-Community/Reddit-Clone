const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCommunityRuleById module", () => {
  let sandbox;
  let getCommunityRuleById;
  let CommunityRuleStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CommunityRule" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityRuleStub = {
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

    getCommunityRuleById = proxyquire(
      "../../../../../src/db-layer/main/CommunityRule/utils/getCommunityRuleById",
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

  describe("getCommunityRuleById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getCommunityRuleById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CommunityRuleStub.findOne);
      sinon.assert.calledWith(
        CommunityRuleStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getCommunityRuleById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CommunityRuleStub.findAll);
      sinon.assert.calledWithMatch(CommunityRuleStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      CommunityRuleStub.findOne.resolves(null);
      const result = await getCommunityRuleById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      CommunityRuleStub.findAll.resolves([]);
      const result = await getCommunityRuleById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      CommunityRuleStub.findOne.rejects(new Error("DB failure"));
      try {
        await getCommunityRuleById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityRuleById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      CommunityRuleStub.findAll.rejects(new Error("array failure"));
      try {
        await getCommunityRuleById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityRuleById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      CommunityRuleStub.findOne.resolves({ getData: () => undefined });
      const result = await getCommunityRuleById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      CommunityRuleStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCommunityRuleById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
