const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getSloEventByQuery module", () => {
  let sandbox;
  let getSloEventByQuery;
  let SloEventStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test SloEvent",
    getData: () => ({ id: fakeId, name: "Test SloEvent" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    SloEventStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getSloEventByQuery = proxyquire(
      "../../../../../src/db-layer/main/SloEvent/utils/getSloEventByQuery",
      {
        models: { SloEvent: SloEventStub },
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

  describe("getSloEventByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getSloEventByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test SloEvent" });
      sinon.assert.calledOnce(SloEventStub.findOne);
      sinon.assert.calledWith(SloEventStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      SloEventStub.findOne.resolves(null);

      const result = await getSloEventByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(SloEventStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getSloEventByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getSloEventByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      SloEventStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getSloEventByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingSloEventByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      SloEventStub.findOne.resolves({ getData: () => undefined });

      const result = await getSloEventByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
