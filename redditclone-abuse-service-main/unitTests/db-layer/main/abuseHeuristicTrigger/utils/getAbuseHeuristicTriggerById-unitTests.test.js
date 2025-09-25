const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAbuseHeuristicTriggerById module", () => {
  let sandbox;
  let getAbuseHeuristicTriggerById;
  let AbuseHeuristicTriggerStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AbuseHeuristicTrigger" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseHeuristicTriggerStub = {
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

    getAbuseHeuristicTriggerById = proxyquire(
      "../../../../../src/db-layer/main/AbuseHeuristicTrigger/utils/getAbuseHeuristicTriggerById",
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

  describe("getAbuseHeuristicTriggerById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getAbuseHeuristicTriggerById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AbuseHeuristicTriggerStub.findOne);
      sinon.assert.calledWith(
        AbuseHeuristicTriggerStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getAbuseHeuristicTriggerById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AbuseHeuristicTriggerStub.findAll);
      sinon.assert.calledWithMatch(AbuseHeuristicTriggerStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      AbuseHeuristicTriggerStub.findOne.resolves(null);
      const result = await getAbuseHeuristicTriggerById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      AbuseHeuristicTriggerStub.findAll.resolves([]);
      const result = await getAbuseHeuristicTriggerById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      AbuseHeuristicTriggerStub.findOne.rejects(new Error("DB failure"));
      try {
        await getAbuseHeuristicTriggerById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseHeuristicTriggerById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      AbuseHeuristicTriggerStub.findAll.rejects(new Error("array failure"));
      try {
        await getAbuseHeuristicTriggerById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseHeuristicTriggerById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      AbuseHeuristicTriggerStub.findOne.resolves({ getData: () => undefined });
      const result = await getAbuseHeuristicTriggerById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      AbuseHeuristicTriggerStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAbuseHeuristicTriggerById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
