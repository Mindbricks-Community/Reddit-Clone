const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getSystemMetricByQuery module", () => {
  let sandbox;
  let getSystemMetricByQuery;
  let SystemMetricStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test SystemMetric",
    getData: () => ({ id: fakeId, name: "Test SystemMetric" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    SystemMetricStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getSystemMetricByQuery = proxyquire(
      "../../../../../src/db-layer/main/SystemMetric/utils/getSystemMetricByQuery",
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
          BadRequestError: class BadRequestError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "BadRequestError";
            }
          },
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getSystemMetricByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getSystemMetricByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test SystemMetric" });
      sinon.assert.calledOnce(SystemMetricStub.findOne);
      sinon.assert.calledWith(SystemMetricStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      SystemMetricStub.findOne.resolves(null);

      const result = await getSystemMetricByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(SystemMetricStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getSystemMetricByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getSystemMetricByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      SystemMetricStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getSystemMetricByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingSystemMetricByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      SystemMetricStub.findOne.resolves({ getData: () => undefined });

      const result = await getSystemMetricByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
