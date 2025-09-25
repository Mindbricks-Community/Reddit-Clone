const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getAlertByQuery module", () => {
  let sandbox;
  let getAlertByQuery;
  let AlertStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test Alert",
    getData: () => ({ id: fakeId, name: "Test Alert" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AlertStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getAlertByQuery = proxyquire(
      "../../../../../src/db-layer/main/Alert/utils/getAlertByQuery",
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

  describe("getAlertByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getAlertByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test Alert" });
      sinon.assert.calledOnce(AlertStub.findOne);
      sinon.assert.calledWith(AlertStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      AlertStub.findOne.resolves(null);

      const result = await getAlertByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(AlertStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getAlertByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getAlertByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      AlertStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getAlertByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAlertByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      AlertStub.findOne.resolves({ getData: () => undefined });

      const result = await getAlertByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
