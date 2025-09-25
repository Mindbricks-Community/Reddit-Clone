const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getModerationAuditLogByQuery module", () => {
  let sandbox;
  let getModerationAuditLogByQuery;
  let ModerationAuditLogStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test ModerationAuditLog",
    getData: () => ({ id: fakeId, name: "Test ModerationAuditLog" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationAuditLogStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getModerationAuditLogByQuery = proxyquire(
      "../../../../../src/db-layer/main/ModerationAuditLog/utils/getModerationAuditLogByQuery",
      {
        models: { ModerationAuditLog: ModerationAuditLogStub },
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

  describe("getModerationAuditLogByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getModerationAuditLogByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test ModerationAuditLog",
      });
      sinon.assert.calledOnce(ModerationAuditLogStub.findOne);
      sinon.assert.calledWith(ModerationAuditLogStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      ModerationAuditLogStub.findOne.resolves(null);

      const result = await getModerationAuditLogByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(ModerationAuditLogStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getModerationAuditLogByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getModerationAuditLogByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      ModerationAuditLogStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getModerationAuditLogByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModerationAuditLogByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      ModerationAuditLogStub.findOne.resolves({ getData: () => undefined });

      const result = await getModerationAuditLogByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
