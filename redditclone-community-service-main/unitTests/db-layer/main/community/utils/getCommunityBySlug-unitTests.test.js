const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCommunityBySlug module", () => {
  let sandbox;
  let getCommunityBySlug;
  let CommunityStub;

  const mockData = { id: "123", name: "Test Community" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityStub = {
      findOne: sandbox.stub().resolves({
        getData: () => mockData,
      }),
    };

    getCommunityBySlug = proxyquire(
      "../../../../../src/db-layer/main/Community/utils/getCommunityBySlug",
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
        sequelize: { Op: require("sequelize").Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getCommunityBySlug", () => {
    it("should return getData() if community is found", async () => {
      const result = await getCommunityBySlug("some-key");
      expect(result).to.deep.equal(mockData);
      sinon.assert.calledOnce(CommunityStub.findOne);
      sinon.assert.calledWithMatch(CommunityStub.findOne, {
        where: { slug: "some-key" },
      });
    });

    it("should return null if community is not found", async () => {
      CommunityStub.findOne.resolves(null);
      const result = await getCommunityBySlug("missing-key");
      expect(result).to.equal(null);
    });

    it("should return undefined if getData returns undefined", async () => {
      CommunityStub.findOne.resolves({ getData: () => undefined });
      const result = await getCommunityBySlug("key");
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError if findOne throws", async () => {
      CommunityStub.findOne.rejects(new Error("db failure"));

      try {
        await getCommunityBySlug("key");
        throw new Error("Expected to throw");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityBySlug",
        );
        expect(err.details.message).to.equal("db failure");
      }
    });
  });
});
