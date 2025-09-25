const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAbuseReportById module", () => {
  let sandbox;
  let getAbuseReportById;
  let AbuseReportStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AbuseReport" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseReportStub = {
      findOne: sandbox.stub().resolves({
        getData: () => fakeData,
      }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
    };

    getAbuseReportById = proxyquire(
      "../../../../../src/db-layer/main/AbuseReport/utils/getAbuseReportById",
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

  describe("getAbuseReportById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getAbuseReportById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AbuseReportStub.findOne);
      sinon.assert.calledWith(
        AbuseReportStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getAbuseReportById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AbuseReportStub.findAll);
      sinon.assert.calledWithMatch(AbuseReportStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      AbuseReportStub.findOne.resolves(null);
      const result = await getAbuseReportById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      AbuseReportStub.findAll.resolves([]);
      const result = await getAbuseReportById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      AbuseReportStub.findOne.rejects(new Error("DB failure"));
      try {
        await getAbuseReportById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseReportById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      AbuseReportStub.findAll.rejects(new Error("array failure"));
      try {
        await getAbuseReportById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseReportById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      AbuseReportStub.findOne.resolves({ getData: () => undefined });
      const result = await getAbuseReportById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      AbuseReportStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAbuseReportById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
