const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAlertAggById module", () => {
  let sandbox;
  let getAlertAggById;
  let AlertStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Alert" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AlertStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getAlertAggById = proxyquire(
      "../../../../../src/db-layer/main/Alert/utils/getAlertAggById",
      {
        models: { Alert: AlertStub },
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

  describe("getAlertAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getAlertAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AlertStub.findOne);
      sinon.assert.calledOnce(AlertStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getAlertAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AlertStub.findAll);
      sinon.assert.calledOnce(AlertStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      AlertStub.findOne.resolves(null);
      const result = await getAlertAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      AlertStub.findAll.resolves([]);
      const result = await getAlertAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      AlertStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAlertAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      AlertStub.findOne.resolves({ getData: () => undefined });
      const result = await getAlertAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      AlertStub.findOne.rejects(new Error("fail"));
      try {
        await getAlertAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAlertAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      AlertStub.findAll.rejects(new Error("all fail"));
      try {
        await getAlertAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAlertAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      AlertStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getAlertAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAlertAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
