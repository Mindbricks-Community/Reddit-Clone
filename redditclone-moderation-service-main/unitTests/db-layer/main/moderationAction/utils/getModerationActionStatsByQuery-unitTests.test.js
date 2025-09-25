const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getModerationActionCountByQuery module", () => {
  let sandbox;
  let getModerationActionCountByQuery;
  let ModerationActionStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationActionStub = {
      count: sandbox.stub(),
      sum: sandbox.stub(),
      avg: sandbox.stub(),
      min: sandbox.stub(),
      max: sandbox.stub(),
    };

    getModerationActionCountByQuery = proxyquire(
      "../../../../../src/db-layer/main/ModerationAction/utils/getModerationActionStatsByQuery",
      {
        models: { ModerationAction: ModerationActionStub },
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

  describe("getModerationActionCountByQuery", () => {
    const query = { isActive: true };

    it("should return count if stats is ['count']", async () => {
      ModerationActionStub.count.resolves(10);
      const result = await getModerationActionCountByQuery(query, ["count"]);
      expect(result).to.equal(10);
    });

    it("should return single sum result if stats is ['sum(price)']", async () => {
      ModerationActionStub.sum.resolves(100);
      const result = await getModerationActionCountByQuery(query, [
        "sum(price)",
      ]);
      expect(result).to.equal(100);
    });

    it("should return single avg result if stats is ['avg(score)']", async () => {
      ModerationActionStub.avg.resolves(42);
      const result = await getModerationActionCountByQuery(query, [
        "avg(score)",
      ]);
      expect(result).to.equal(42);
    });

    it("should return single min result if stats is ['min(height)']", async () => {
      ModerationActionStub.min.resolves(1);
      const result = await getModerationActionCountByQuery(query, [
        "min(height)",
      ]);
      expect(result).to.equal(1);
    });

    it("should return single max result if stats is ['max(weight)']", async () => {
      ModerationActionStub.max.resolves(99);
      const result = await getModerationActionCountByQuery(query, [
        "max(weight)",
      ]);
      expect(result).to.equal(99);
    });

    it("should return object for multiple stats", async () => {
      ModerationActionStub.count.resolves(5);
      ModerationActionStub.sum.resolves(150);
      ModerationActionStub.avg.resolves(75);

      const result = await getModerationActionCountByQuery(query, [
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
      ModerationActionStub.count.resolves(7);
      const result = await getModerationActionCountByQuery(query, []);
      expect(result).to.equal(7);
    });

    it("should fallback to count if stats has no valid entry", async () => {
      ModerationActionStub.count.resolves(99);
      const result = await getModerationActionCountByQuery(query, [
        "unknown()",
      ]);
      expect(result).to.equal(99);
    });

    it("should wrap error in HttpServerError if count fails", async () => {
      ModerationActionStub.count.rejects(new Error("count failed"));
      try {
        await getModerationActionCountByQuery(query, ["count"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModerationActionStatsByQuery",
        );
        expect(err.details.message).to.equal("count failed");
      }
    });

    it("should wrap error in HttpServerError if sum fails", async () => {
      ModerationActionStub.sum.rejects(new Error("sum failed"));
      try {
        await getModerationActionCountByQuery(query, ["sum(price)"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("sum failed");
      }
    });
  });
});
