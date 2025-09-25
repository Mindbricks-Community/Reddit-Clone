const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getAbuseHeuristicTriggerCountByQuery module", () => {
  let sandbox;
  let getAbuseHeuristicTriggerCountByQuery;
  let AbuseHeuristicTriggerStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseHeuristicTriggerStub = {
      count: sandbox.stub(),
      sum: sandbox.stub(),
      avg: sandbox.stub(),
      min: sandbox.stub(),
      max: sandbox.stub(),
    };

    getAbuseHeuristicTriggerCountByQuery = proxyquire(
      "../../../../../src/db-layer/main/AbuseHeuristicTrigger/utils/getAbuseHeuristicTriggerStatsByQuery",
      {
        models: { AbuseHeuristicTrigger: AbuseHeuristicTriggerStub },
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

  describe("getAbuseHeuristicTriggerCountByQuery", () => {
    const query = { isActive: true };

    it("should return count if stats is ['count']", async () => {
      AbuseHeuristicTriggerStub.count.resolves(10);
      const result = await getAbuseHeuristicTriggerCountByQuery(query, [
        "count",
      ]);
      expect(result).to.equal(10);
    });

    it("should return single sum result if stats is ['sum(price)']", async () => {
      AbuseHeuristicTriggerStub.sum.resolves(100);
      const result = await getAbuseHeuristicTriggerCountByQuery(query, [
        "sum(price)",
      ]);
      expect(result).to.equal(100);
    });

    it("should return single avg result if stats is ['avg(score)']", async () => {
      AbuseHeuristicTriggerStub.avg.resolves(42);
      const result = await getAbuseHeuristicTriggerCountByQuery(query, [
        "avg(score)",
      ]);
      expect(result).to.equal(42);
    });

    it("should return single min result if stats is ['min(height)']", async () => {
      AbuseHeuristicTriggerStub.min.resolves(1);
      const result = await getAbuseHeuristicTriggerCountByQuery(query, [
        "min(height)",
      ]);
      expect(result).to.equal(1);
    });

    it("should return single max result if stats is ['max(weight)']", async () => {
      AbuseHeuristicTriggerStub.max.resolves(99);
      const result = await getAbuseHeuristicTriggerCountByQuery(query, [
        "max(weight)",
      ]);
      expect(result).to.equal(99);
    });

    it("should return object for multiple stats", async () => {
      AbuseHeuristicTriggerStub.count.resolves(5);
      AbuseHeuristicTriggerStub.sum.resolves(150);
      AbuseHeuristicTriggerStub.avg.resolves(75);

      const result = await getAbuseHeuristicTriggerCountByQuery(query, [
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
      AbuseHeuristicTriggerStub.count.resolves(7);
      const result = await getAbuseHeuristicTriggerCountByQuery(query, []);
      expect(result).to.equal(7);
    });

    it("should fallback to count if stats has no valid entry", async () => {
      AbuseHeuristicTriggerStub.count.resolves(99);
      const result = await getAbuseHeuristicTriggerCountByQuery(query, [
        "unknown()",
      ]);
      expect(result).to.equal(99);
    });

    it("should wrap error in HttpServerError if count fails", async () => {
      AbuseHeuristicTriggerStub.count.rejects(new Error("count failed"));
      try {
        await getAbuseHeuristicTriggerCountByQuery(query, ["count"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseHeuristicTriggerStatsByQuery",
        );
        expect(err.details.message).to.equal("count failed");
      }
    });

    it("should wrap error in HttpServerError if sum fails", async () => {
      AbuseHeuristicTriggerStub.sum.rejects(new Error("sum failed"));
      try {
        await getAbuseHeuristicTriggerCountByQuery(query, ["sum(price)"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("sum failed");
      }
    });
  });
});
