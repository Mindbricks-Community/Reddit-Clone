const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCommunityCountByQuery module", () => {
  let sandbox;
  let getCommunityCountByQuery;
  let CommunityStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityStub = {
      count: sandbox.stub(),
      sum: sandbox.stub(),
      avg: sandbox.stub(),
      min: sandbox.stub(),
      max: sandbox.stub(),
    };

    getCommunityCountByQuery = proxyquire(
      "../../../../../src/db-layer/main/Community/utils/getCommunityStatsByQuery",
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

  describe("getCommunityCountByQuery", () => {
    const query = { isActive: true };

    it("should return count if stats is ['count']", async () => {
      CommunityStub.count.resolves(10);
      const result = await getCommunityCountByQuery(query, ["count"]);
      expect(result).to.equal(10);
    });

    it("should return single sum result if stats is ['sum(price)']", async () => {
      CommunityStub.sum.resolves(100);
      const result = await getCommunityCountByQuery(query, ["sum(price)"]);
      expect(result).to.equal(100);
    });

    it("should return single avg result if stats is ['avg(score)']", async () => {
      CommunityStub.avg.resolves(42);
      const result = await getCommunityCountByQuery(query, ["avg(score)"]);
      expect(result).to.equal(42);
    });

    it("should return single min result if stats is ['min(height)']", async () => {
      CommunityStub.min.resolves(1);
      const result = await getCommunityCountByQuery(query, ["min(height)"]);
      expect(result).to.equal(1);
    });

    it("should return single max result if stats is ['max(weight)']", async () => {
      CommunityStub.max.resolves(99);
      const result = await getCommunityCountByQuery(query, ["max(weight)"]);
      expect(result).to.equal(99);
    });

    it("should return object for multiple stats", async () => {
      CommunityStub.count.resolves(5);
      CommunityStub.sum.resolves(150);
      CommunityStub.avg.resolves(75);

      const result = await getCommunityCountByQuery(query, [
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
      CommunityStub.count.resolves(7);
      const result = await getCommunityCountByQuery(query, []);
      expect(result).to.equal(7);
    });

    it("should fallback to count if stats has no valid entry", async () => {
      CommunityStub.count.resolves(99);
      const result = await getCommunityCountByQuery(query, ["unknown()"]);
      expect(result).to.equal(99);
    });

    it("should wrap error in HttpServerError if count fails", async () => {
      CommunityStub.count.rejects(new Error("count failed"));
      try {
        await getCommunityCountByQuery(query, ["count"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityStatsByQuery",
        );
        expect(err.details.message).to.equal("count failed");
      }
    });

    it("should wrap error in HttpServerError if sum fails", async () => {
      CommunityStub.sum.rejects(new Error("sum failed"));
      try {
        await getCommunityCountByQuery(query, ["sum(price)"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("sum failed");
      }
    });
  });
});
