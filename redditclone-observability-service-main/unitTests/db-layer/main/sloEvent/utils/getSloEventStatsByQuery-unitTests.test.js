const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getSloEventCountByQuery module", () => {
  let sandbox;
  let getSloEventCountByQuery;
  let SloEventStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    SloEventStub = {
      count: sandbox.stub(),
      sum: sandbox.stub(),
      avg: sandbox.stub(),
      min: sandbox.stub(),
      max: sandbox.stub(),
    };

    getSloEventCountByQuery = proxyquire(
      "../../../../../src/db-layer/main/SloEvent/utils/getSloEventStatsByQuery",
      {
        models: { SloEvent: SloEventStub },
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

  describe("getSloEventCountByQuery", () => {
    const query = { isActive: true };

    it("should return count if stats is ['count']", async () => {
      SloEventStub.count.resolves(10);
      const result = await getSloEventCountByQuery(query, ["count"]);
      expect(result).to.equal(10);
    });

    it("should return single sum result if stats is ['sum(price)']", async () => {
      SloEventStub.sum.resolves(100);
      const result = await getSloEventCountByQuery(query, ["sum(price)"]);
      expect(result).to.equal(100);
    });

    it("should return single avg result if stats is ['avg(score)']", async () => {
      SloEventStub.avg.resolves(42);
      const result = await getSloEventCountByQuery(query, ["avg(score)"]);
      expect(result).to.equal(42);
    });

    it("should return single min result if stats is ['min(height)']", async () => {
      SloEventStub.min.resolves(1);
      const result = await getSloEventCountByQuery(query, ["min(height)"]);
      expect(result).to.equal(1);
    });

    it("should return single max result if stats is ['max(weight)']", async () => {
      SloEventStub.max.resolves(99);
      const result = await getSloEventCountByQuery(query, ["max(weight)"]);
      expect(result).to.equal(99);
    });

    it("should return object for multiple stats", async () => {
      SloEventStub.count.resolves(5);
      SloEventStub.sum.resolves(150);
      SloEventStub.avg.resolves(75);

      const result = await getSloEventCountByQuery(query, [
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
      SloEventStub.count.resolves(7);
      const result = await getSloEventCountByQuery(query, []);
      expect(result).to.equal(7);
    });

    it("should fallback to count if stats has no valid entry", async () => {
      SloEventStub.count.resolves(99);
      const result = await getSloEventCountByQuery(query, ["unknown()"]);
      expect(result).to.equal(99);
    });

    it("should wrap error in HttpServerError if count fails", async () => {
      SloEventStub.count.rejects(new Error("count failed"));
      try {
        await getSloEventCountByQuery(query, ["count"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingSloEventStatsByQuery",
        );
        expect(err.details.message).to.equal("count failed");
      }
    });

    it("should wrap error in HttpServerError if sum fails", async () => {
      SloEventStub.sum.rejects(new Error("sum failed"));
      try {
        await getSloEventCountByQuery(query, ["sum(price)"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("sum failed");
      }
    });
  });
});
