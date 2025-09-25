const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAbuseInvestigationAggById module", () => {
  let sandbox;
  let getAbuseInvestigationAggById;
  let AbuseInvestigationStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AbuseInvestigation" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseInvestigationStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getAbuseInvestigationAggById = proxyquire(
      "../../../../../src/db-layer/main/AbuseInvestigation/utils/getAbuseInvestigationAggById",
      {
        models: { AbuseInvestigation: AbuseInvestigationStub },
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

  describe("getAbuseInvestigationAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getAbuseInvestigationAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AbuseInvestigationStub.findOne);
      sinon.assert.calledOnce(AbuseInvestigationStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getAbuseInvestigationAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AbuseInvestigationStub.findAll);
      sinon.assert.calledOnce(AbuseInvestigationStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      AbuseInvestigationStub.findOne.resolves(null);
      const result = await getAbuseInvestigationAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      AbuseInvestigationStub.findAll.resolves([]);
      const result = await getAbuseInvestigationAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      AbuseInvestigationStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAbuseInvestigationAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      AbuseInvestigationStub.findOne.resolves({ getData: () => undefined });
      const result = await getAbuseInvestigationAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      AbuseInvestigationStub.findOne.rejects(new Error("fail"));
      try {
        await getAbuseInvestigationAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseInvestigationAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      AbuseInvestigationStub.findAll.rejects(new Error("all fail"));
      try {
        await getAbuseInvestigationAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseInvestigationAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      AbuseInvestigationStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getAbuseInvestigationAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseInvestigationAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
