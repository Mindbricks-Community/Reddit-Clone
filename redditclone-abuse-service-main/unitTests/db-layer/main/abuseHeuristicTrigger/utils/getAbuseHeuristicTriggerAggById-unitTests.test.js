const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAbuseHeuristicTriggerAggById module", () => {
  let sandbox;
  let getAbuseHeuristicTriggerAggById;
  let AbuseHeuristicTriggerStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AbuseHeuristicTrigger" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseHeuristicTriggerStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getAbuseHeuristicTriggerAggById = proxyquire(
      "../../../../../src/db-layer/main/AbuseHeuristicTrigger/utils/getAbuseHeuristicTriggerAggById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getAbuseHeuristicTriggerAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getAbuseHeuristicTriggerAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AbuseHeuristicTriggerStub.findOne);
      sinon.assert.calledOnce(AbuseHeuristicTriggerStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getAbuseHeuristicTriggerAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AbuseHeuristicTriggerStub.findAll);
      sinon.assert.calledOnce(AbuseHeuristicTriggerStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      AbuseHeuristicTriggerStub.findOne.resolves(null);
      const result = await getAbuseHeuristicTriggerAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      AbuseHeuristicTriggerStub.findAll.resolves([]);
      const result = await getAbuseHeuristicTriggerAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      AbuseHeuristicTriggerStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAbuseHeuristicTriggerAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      AbuseHeuristicTriggerStub.findOne.resolves({ getData: () => undefined });
      const result = await getAbuseHeuristicTriggerAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      AbuseHeuristicTriggerStub.findOne.rejects(new Error("fail"));
      try {
        await getAbuseHeuristicTriggerAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseHeuristicTriggerAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      AbuseHeuristicTriggerStub.findAll.rejects(new Error("all fail"));
      try {
        await getAbuseHeuristicTriggerAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseHeuristicTriggerAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      AbuseHeuristicTriggerStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getAbuseHeuristicTriggerAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseHeuristicTriggerAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
