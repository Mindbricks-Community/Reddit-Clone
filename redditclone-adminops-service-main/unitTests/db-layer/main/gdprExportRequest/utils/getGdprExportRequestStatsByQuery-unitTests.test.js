const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getGdprExportRequestCountByQuery module", () => {
  let sandbox;
  let getGdprExportRequestCountByQuery;
  let GdprExportRequestStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprExportRequestStub = {
      count: sandbox.stub(),
      sum: sandbox.stub(),
      avg: sandbox.stub(),
      min: sandbox.stub(),
      max: sandbox.stub(),
    };

    getGdprExportRequestCountByQuery = proxyquire(
      "../../../../../src/db-layer/main/GdprExportRequest/utils/getGdprExportRequestStatsByQuery",
      {
        models: { GdprExportRequest: GdprExportRequestStub },
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

  describe("getGdprExportRequestCountByQuery", () => {
    const query = { isActive: true };

    it("should return count if stats is ['count']", async () => {
      GdprExportRequestStub.count.resolves(10);
      const result = await getGdprExportRequestCountByQuery(query, ["count"]);
      expect(result).to.equal(10);
    });

    it("should return single sum result if stats is ['sum(price)']", async () => {
      GdprExportRequestStub.sum.resolves(100);
      const result = await getGdprExportRequestCountByQuery(query, [
        "sum(price)",
      ]);
      expect(result).to.equal(100);
    });

    it("should return single avg result if stats is ['avg(score)']", async () => {
      GdprExportRequestStub.avg.resolves(42);
      const result = await getGdprExportRequestCountByQuery(query, [
        "avg(score)",
      ]);
      expect(result).to.equal(42);
    });

    it("should return single min result if stats is ['min(height)']", async () => {
      GdprExportRequestStub.min.resolves(1);
      const result = await getGdprExportRequestCountByQuery(query, [
        "min(height)",
      ]);
      expect(result).to.equal(1);
    });

    it("should return single max result if stats is ['max(weight)']", async () => {
      GdprExportRequestStub.max.resolves(99);
      const result = await getGdprExportRequestCountByQuery(query, [
        "max(weight)",
      ]);
      expect(result).to.equal(99);
    });

    it("should return object for multiple stats", async () => {
      GdprExportRequestStub.count.resolves(5);
      GdprExportRequestStub.sum.resolves(150);
      GdprExportRequestStub.avg.resolves(75);

      const result = await getGdprExportRequestCountByQuery(query, [
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
      GdprExportRequestStub.count.resolves(7);
      const result = await getGdprExportRequestCountByQuery(query, []);
      expect(result).to.equal(7);
    });

    it("should fallback to count if stats has no valid entry", async () => {
      GdprExportRequestStub.count.resolves(99);
      const result = await getGdprExportRequestCountByQuery(query, [
        "unknown()",
      ]);
      expect(result).to.equal(99);
    });

    it("should wrap error in HttpServerError if count fails", async () => {
      GdprExportRequestStub.count.rejects(new Error("count failed"));
      try {
        await getGdprExportRequestCountByQuery(query, ["count"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprExportRequestStatsByQuery",
        );
        expect(err.details.message).to.equal("count failed");
      }
    });

    it("should wrap error in HttpServerError if sum fails", async () => {
      GdprExportRequestStub.sum.rejects(new Error("sum failed"));
      try {
        await getGdprExportRequestCountByQuery(query, ["sum(price)"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("sum failed");
      }
    });
  });
});
