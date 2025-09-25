const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getAutomodEventByQuery module", () => {
  let sandbox;
  let getAutomodEventByQuery;
  let AutomodEventStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test AutomodEvent",
    getData: () => ({ id: fakeId, name: "Test AutomodEvent" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AutomodEventStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getAutomodEventByQuery = proxyquire(
      "../../../../../src/db-layer/main/AutomodEvent/utils/getAutomodEventByQuery",
      {
        models: { AutomodEvent: AutomodEventStub },
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

  describe("getAutomodEventByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getAutomodEventByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test AutomodEvent" });
      sinon.assert.calledOnce(AutomodEventStub.findOne);
      sinon.assert.calledWith(AutomodEventStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      AutomodEventStub.findOne.resolves(null);

      const result = await getAutomodEventByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(AutomodEventStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getAutomodEventByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getAutomodEventByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      AutomodEventStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getAutomodEventByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAutomodEventByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      AutomodEventStub.findOne.resolves({ getData: () => undefined });

      const result = await getAutomodEventByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
