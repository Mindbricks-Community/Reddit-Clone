const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getPollOptionByQuery module", () => {
  let sandbox;
  let getPollOptionByQuery;
  let PollOptionStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test PollOption",
    getData: () => ({ id: fakeId, name: "Test PollOption" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PollOptionStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getPollOptionByQuery = proxyquire(
      "../../../../../src/db-layer/main/PollOption/utils/getPollOptionByQuery",
      {
        models: { PollOption: PollOptionStub },
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

  describe("getPollOptionByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getPollOptionByQuery({ id: fakeId });

      expect(result).to.deep.equal({ id: fakeId, name: "Test PollOption" });
      sinon.assert.calledOnce(PollOptionStub.findOne);
      sinon.assert.calledWith(PollOptionStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      PollOptionStub.findOne.resolves(null);

      const result = await getPollOptionByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(PollOptionStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getPollOptionByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getPollOptionByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      PollOptionStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getPollOptionByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPollOptionByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      PollOptionStub.findOne.resolves({ getData: () => undefined });

      const result = await getPollOptionByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
