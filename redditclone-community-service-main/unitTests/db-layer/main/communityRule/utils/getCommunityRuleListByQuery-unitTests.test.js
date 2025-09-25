const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCommunityRuleListByQuery module", () => {
  let sandbox;
  let getCommunityRuleListByQuery;
  let CommunityRuleStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityRuleStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getCommunityRuleListByQuery = proxyquire(
      "../../../../../src/db-layer/main/CommunityRule/utils/getCommunityRuleListByQuery",
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
          BadRequestError: class BadRequestError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "BadRequestError";
            }
          },
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getCommunityRuleListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getCommunityRuleListByQuery({ isActive: true });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(CommunityRuleStub.findAll);
      sinon.assert.calledWithMatch(CommunityRuleStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      CommunityRuleStub.findAll.resolves(null);

      const result = await getCommunityRuleListByQuery({ active: false });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      CommunityRuleStub.findAll.resolves([]);

      const result = await getCommunityRuleListByQuery({ clientId: "xyz" });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      CommunityRuleStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getCommunityRuleListByQuery({ active: true });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCommunityRuleListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCommunityRuleListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      CommunityRuleStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getCommunityRuleListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityRuleListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
