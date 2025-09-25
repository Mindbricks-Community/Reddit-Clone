const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getModmailThreadByQuery module", () => {
  let sandbox;
  let getModmailThreadByQuery;
  let ModmailThreadStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test ModmailThread",
    getData: () => ({ id: fakeId, name: "Test ModmailThread" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModmailThreadStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getModmailThreadByQuery = proxyquire(
      "../../../../../src/db-layer/main/ModmailThread/utils/getModmailThreadByQuery",
      {
        models: { ModmailThread: ModmailThreadStub },
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

  describe("getModmailThreadByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getModmailThreadByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test ModmailThread" });
      sinon.assert.calledOnce(ModmailThreadStub.findOne);
      sinon.assert.calledWith(ModmailThreadStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      ModmailThreadStub.findOne.resolves(null);

      const result = await getModmailThreadByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(ModmailThreadStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getModmailThreadByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getModmailThreadByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      ModmailThreadStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getModmailThreadByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModmailThreadByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      ModmailThreadStub.findOne.resolves({ getData: () => undefined });

      const result = await getModmailThreadByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
