const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getSystemMetricById module", () => {
  let sandbox;
  let getSystemMetricById;
  let SystemMetricStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test SystemMetric" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    SystemMetricStub = {
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

    getSystemMetricById = proxyquire(
      "../../../../../src/db-layer/main/SystemMetric/utils/getSystemMetricById",
      {
        models: { SystemMetric: SystemMetricStub },
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

  describe("getSystemMetricById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getSystemMetricById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(SystemMetricStub.findOne);
      sinon.assert.calledWith(
        SystemMetricStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getSystemMetricById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(SystemMetricStub.findAll);
      sinon.assert.calledWithMatch(SystemMetricStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      SystemMetricStub.findOne.resolves(null);
      const result = await getSystemMetricById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      SystemMetricStub.findAll.resolves([]);
      const result = await getSystemMetricById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      SystemMetricStub.findOne.rejects(new Error("DB failure"));
      try {
        await getSystemMetricById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingSystemMetricById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      SystemMetricStub.findAll.rejects(new Error("array failure"));
      try {
        await getSystemMetricById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingSystemMetricById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      SystemMetricStub.findOne.resolves({ getData: () => undefined });
      const result = await getSystemMetricById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      SystemMetricStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getSystemMetricById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
