const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAbuseReportAggById module", () => {
  let sandbox;
  let getAbuseReportAggById;
  let AbuseReportStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AbuseReport" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseReportStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getAbuseReportAggById = proxyquire(
      "../../../../../src/db-layer/main/AbuseReport/utils/getAbuseReportAggById",
      {
        models: { AbuseReport: AbuseReportStub },
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

  describe("getAbuseReportAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getAbuseReportAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AbuseReportStub.findOne);
      sinon.assert.calledOnce(AbuseReportStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getAbuseReportAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AbuseReportStub.findAll);
      sinon.assert.calledOnce(AbuseReportStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      AbuseReportStub.findOne.resolves(null);
      const result = await getAbuseReportAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      AbuseReportStub.findAll.resolves([]);
      const result = await getAbuseReportAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      AbuseReportStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAbuseReportAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      AbuseReportStub.findOne.resolves({ getData: () => undefined });
      const result = await getAbuseReportAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      AbuseReportStub.findOne.rejects(new Error("fail"));
      try {
        await getAbuseReportAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseReportAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      AbuseReportStub.findAll.rejects(new Error("all fail"));
      try {
        await getAbuseReportAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseReportAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      AbuseReportStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getAbuseReportAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseReportAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
