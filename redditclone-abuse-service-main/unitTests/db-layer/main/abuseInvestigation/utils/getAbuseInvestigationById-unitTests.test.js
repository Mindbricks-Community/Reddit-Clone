const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAbuseInvestigationById module", () => {
  let sandbox;
  let getAbuseInvestigationById;
  let AbuseInvestigationStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AbuseInvestigation" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseInvestigationStub = {
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

    getAbuseInvestigationById = proxyquire(
      "../../../../../src/db-layer/main/AbuseInvestigation/utils/getAbuseInvestigationById",
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

  describe("getAbuseInvestigationById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getAbuseInvestigationById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AbuseInvestigationStub.findOne);
      sinon.assert.calledWith(
        AbuseInvestigationStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getAbuseInvestigationById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AbuseInvestigationStub.findAll);
      sinon.assert.calledWithMatch(AbuseInvestigationStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      AbuseInvestigationStub.findOne.resolves(null);
      const result = await getAbuseInvestigationById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      AbuseInvestigationStub.findAll.resolves([]);
      const result = await getAbuseInvestigationById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      AbuseInvestigationStub.findOne.rejects(new Error("DB failure"));
      try {
        await getAbuseInvestigationById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseInvestigationById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      AbuseInvestigationStub.findAll.rejects(new Error("array failure"));
      try {
        await getAbuseInvestigationById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseInvestigationById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      AbuseInvestigationStub.findOne.resolves({ getData: () => undefined });
      const result = await getAbuseInvestigationById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      AbuseInvestigationStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAbuseInvestigationById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
