const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getModmailMessageByQuery module", () => {
  let sandbox;
  let getModmailMessageByQuery;
  let ModmailMessageStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test ModmailMessage",
    getData: () => ({ id: fakeId, name: "Test ModmailMessage" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModmailMessageStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getModmailMessageByQuery = proxyquire(
      "../../../../../src/db-layer/main/ModmailMessage/utils/getModmailMessageByQuery",
      {
        models: { ModmailMessage: ModmailMessageStub },
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

  describe("getModmailMessageByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getModmailMessageByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test ModmailMessage" });
      sinon.assert.calledOnce(ModmailMessageStub.findOne);
      sinon.assert.calledWith(ModmailMessageStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      ModmailMessageStub.findOne.resolves(null);

      const result = await getModmailMessageByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(ModmailMessageStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getModmailMessageByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getModmailMessageByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      ModmailMessageStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getModmailMessageByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModmailMessageByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      ModmailMessageStub.findOne.resolves({ getData: () => undefined });

      const result = await getModmailMessageByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
