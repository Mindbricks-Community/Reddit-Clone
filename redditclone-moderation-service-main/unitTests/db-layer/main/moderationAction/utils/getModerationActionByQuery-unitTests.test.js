const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getModerationActionByQuery module", () => {
  let sandbox;
  let getModerationActionByQuery;
  let ModerationActionStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test ModerationAction",
    getData: () => ({ id: fakeId, name: "Test ModerationAction" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationActionStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getModerationActionByQuery = proxyquire(
      "../../../../../src/db-layer/main/ModerationAction/utils/getModerationActionByQuery",
      {
        models: { ModerationAction: ModerationActionStub },
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

  describe("getModerationActionByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getModerationActionByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test ModerationAction",
      });
      sinon.assert.calledOnce(ModerationActionStub.findOne);
      sinon.assert.calledWith(ModerationActionStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      ModerationActionStub.findOne.resolves(null);

      const result = await getModerationActionByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(ModerationActionStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getModerationActionByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getModerationActionByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      ModerationActionStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getModerationActionByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModerationActionByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      ModerationActionStub.findOne.resolves({ getData: () => undefined });

      const result = await getModerationActionByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
