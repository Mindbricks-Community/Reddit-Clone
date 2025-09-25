const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCommunityMemberCountByQuery module", () => {
  let sandbox;
  let getCommunityMemberCountByQuery;
  let CommunityMemberStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityMemberStub = {
      count: sandbox.stub(),
      sum: sandbox.stub(),
      avg: sandbox.stub(),
      min: sandbox.stub(),
      max: sandbox.stub(),
    };

    getCommunityMemberCountByQuery = proxyquire(
      "../../../../../src/db-layer/main/CommunityMember/utils/getCommunityMemberStatsByQuery",
      {
        models: { CommunityMember: CommunityMemberStub },
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

  describe("getCommunityMemberCountByQuery", () => {
    const query = { isActive: true };

    it("should return count if stats is ['count']", async () => {
      CommunityMemberStub.count.resolves(10);
      const result = await getCommunityMemberCountByQuery(query, ["count"]);
      expect(result).to.equal(10);
    });

    it("should return single sum result if stats is ['sum(price)']", async () => {
      CommunityMemberStub.sum.resolves(100);
      const result = await getCommunityMemberCountByQuery(query, [
        "sum(price)",
      ]);
      expect(result).to.equal(100);
    });

    it("should return single avg result if stats is ['avg(score)']", async () => {
      CommunityMemberStub.avg.resolves(42);
      const result = await getCommunityMemberCountByQuery(query, [
        "avg(score)",
      ]);
      expect(result).to.equal(42);
    });

    it("should return single min result if stats is ['min(height)']", async () => {
      CommunityMemberStub.min.resolves(1);
      const result = await getCommunityMemberCountByQuery(query, [
        "min(height)",
      ]);
      expect(result).to.equal(1);
    });

    it("should return single max result if stats is ['max(weight)']", async () => {
      CommunityMemberStub.max.resolves(99);
      const result = await getCommunityMemberCountByQuery(query, [
        "max(weight)",
      ]);
      expect(result).to.equal(99);
    });

    it("should return object for multiple stats", async () => {
      CommunityMemberStub.count.resolves(5);
      CommunityMemberStub.sum.resolves(150);
      CommunityMemberStub.avg.resolves(75);

      const result = await getCommunityMemberCountByQuery(query, [
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
      CommunityMemberStub.count.resolves(7);
      const result = await getCommunityMemberCountByQuery(query, []);
      expect(result).to.equal(7);
    });

    it("should fallback to count if stats has no valid entry", async () => {
      CommunityMemberStub.count.resolves(99);
      const result = await getCommunityMemberCountByQuery(query, ["unknown()"]);
      expect(result).to.equal(99);
    });

    it("should wrap error in HttpServerError if count fails", async () => {
      CommunityMemberStub.count.rejects(new Error("count failed"));
      try {
        await getCommunityMemberCountByQuery(query, ["count"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityMemberStatsByQuery",
        );
        expect(err.details.message).to.equal("count failed");
      }
    });

    it("should wrap error in HttpServerError if sum fails", async () => {
      CommunityMemberStub.sum.rejects(new Error("sum failed"));
      try {
        await getCommunityMemberCountByQuery(query, ["sum(price)"]);
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("sum failed");
      }
    });
  });
});
