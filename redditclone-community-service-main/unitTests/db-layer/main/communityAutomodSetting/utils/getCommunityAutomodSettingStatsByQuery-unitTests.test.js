const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCommunityAutomodSettingCountByQuery module", () => {
  let sandbox;
  let getCommunityAutomodSettingCountByQuery;
  let CommunityAutomodSettingStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityAutomodSettingStub = {
      count: sandbox.stub(),
      sum: sandbox.stub(),
      avg: sandbox.stub(),
      min: sandbox.stub(),
      max: sandbox.stub(),
    };

    getCommunityAutomodSettingCountByQuery = proxyquire(
      "../../../../../src/db-layer/main/CommunityAutomodSetting/utils/getCommunityAutomodSettingStatsByQuery",
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
          BadRequestError: class BadRequestError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "BadRequestError";
            }
          },
          hexaLogger: { insertError: sandbox.stub() },
        },
        sequelize: { Op: require("sequelize").Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getCommunityAutomodSettingCountByQuery", () => {
    const query = { isActive: true };

    it("should return count if stats is ['count']", async () => {
      CommunityAutomodSettingStub.count.resolves(10);
      const result = await getCommunityAutomodSettingCountByQuery(query, [
        "count",
      ]);
      expect(result).to.equal(10);
    });

    it("should return single sum result if stats is ['sum(price)']", async () => {
      CommunityAutomodSettingStub.sum.resolves(100);
      const result = await getCommunityAutomodSettingCountByQuery(query, [
        "sum(price)",
      ]);
      expect(result).to.equal(100);
    });

    it("should return single avg result if stats is ['avg(score)']", async () => {
      CommunityAutomodSettingStub.avg.resolves(42);
      const result = await getCommunityAutomodSettingCountByQuery(query, [
        "avg(score)",
      ]);
      expect(result).to.equal(42);
    });

    it("should return single min result if stats is ['min(height)']", async () => {
      CommunityAutomodSettingStub.min.resolves(1);
      const result = await getCommunityAutomodSettingCountByQuery(query, [
        "min(height)",
      ]);
      expect(result).to.equal(1);
    });

    it("should return single max result if stats is ['max(weight)']", async () => {
      CommunityAutomodSettingStub.max.resolves(99);
      const result = await getCommunityAutomodSettingCountByQuery(query, [
        "max(weight)",
      ]);
      expect(result).to.equal(99);
    });

    it("should return object for multiple stats", async () => {
      CommunityAutomodSettingStub.count.resolves(5);
      CommunityAutomodSettingStub.sum.resolves(150);
      CommunityAutomodSettingStub.avg.resolves(75);

      const result = await getCommunityAutomodSettingCountByQuery(query, [
        "count",
        "sum(price)",
        "avg(score)",
      ]);

      expect(result).to.deep.equal({
        count: 5,
        "sum-price": 150,
        "avg-score": 75,
      });
    });

    it("should fallback to count if stats is empty", async () => {
      CommunityAutomodSettingStub.count.resolves(7);
      const result = await getCommunityAutomodSettingCountByQuery(query, []);
      expect(result).to.equal(7);
    });

    it("should fallback to count if stats has no valid entry", async () => {
      CommunityAutomodSettingStub.count.resolves(99);
      const result = await getCommunityAutomodSettingCountByQuery(query, [
        "unknown()",
      ]);
      expect(result).to.equal(99);
    });

    it("should wrap error in HttpServerError if count fails", async () => {
      CommunityAutomodSettingStub.count.rejects(new Error("count failed"));
      try {
        await getCommunityAutomodSettingCountByQuery(query, ["count"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityAutomodSettingStatsByQuery",
        );
        expect(err.details.message).to.equal("count failed");
      }
    });

    it("should wrap error in HttpServerError if sum fails", async () => {
      CommunityAutomodSettingStub.sum.rejects(new Error("sum failed"));
      try {
        await getCommunityAutomodSettingCountByQuery(query, ["sum(price)"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("sum failed");
      }
    });
  });
});
