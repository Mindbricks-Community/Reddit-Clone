const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getErrorLogByQuery module", () => {
  let sandbox;
  let getErrorLogByQuery;
  let ErrorLogStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test ErrorLog",
    getData: () => ({ id: fakeId, name: "Test ErrorLog" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ErrorLogStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getErrorLogByQuery = proxyquire(
      "../../../../../src/db-layer/main/ErrorLog/utils/getErrorLogByQuery",
      {
        models: { ErrorLog: ErrorLogStub },
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

  describe("getErrorLogByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getErrorLogByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test ErrorLog" });
      sinon.assert.calledOnce(ErrorLogStub.findOne);
      sinon.assert.calledWith(ErrorLogStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      ErrorLogStub.findOne.resolves(null);

      const result = await getErrorLogByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(ErrorLogStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getErrorLogByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getErrorLogByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      ErrorLogStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getErrorLogByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingErrorLogByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      ErrorLogStub.findOne.resolves({ getData: () => undefined });

      const result = await getErrorLogByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
