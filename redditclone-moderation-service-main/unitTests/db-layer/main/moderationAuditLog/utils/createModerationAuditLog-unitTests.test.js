const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createModerationAuditLog module", () => {
  let sandbox;
  let createModerationAuditLog;
  let ModerationAuditLogStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const baseValidInput = {
    logEntryType: "logEntryType_val",
    communityId: "communityId_val",
  };
  const mockCreatedModerationAuditLog = {
    getData: () => ({ id: fakeId, ...baseValidInput }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationAuditLogStub = {
      create: sandbox.stub().resolves(mockCreatedModerationAuditLog),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createModerationAuditLog = proxyquire(
      "../../../../../src/db-layer/main/ModerationAuditLog/utils/createModerationAuditLog",
      {
        models: { ModerationAuditLog: ModerationAuditLogStub },
        serviceCommon: { ElasticIndexer: ElasticIndexerStub },
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
          newUUID: newUUIDStub,
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  const getValidInput = (overrides = {}) => ({
    ...baseValidInput,
    ...overrides,
  });

  describe("createModerationAuditLog", () => {
    it("should create ModerationAuditLog and index to elastic if valid data", async () => {
      const input = getValidInput();
      const result = await createModerationAuditLog(input);

      expect(result).to.deep.equal({ id: fakeId, ...baseValidInput });
      sinon.assert.calledOnce(ModerationAuditLogStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);
    });

    it("should throw HttpServerError if ModerationAuditLog.create fails", async () => {
      ModerationAuditLogStub.create.rejects(new Error("DB error"));
      const input = getValidInput();

      try {
        await createModerationAuditLog(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingModerationAuditLog",
        );
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = getValidInput();
      delete input.id;
      await createModerationAuditLog(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = getValidInput({ id: "existing-id" });
      await createModerationAuditLog(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        ModerationAuditLogStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is satisfied", async () => {
      const input = getValidInput();
      await createModerationAuditLog(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = getValidInput({ id: "custom-id" });
      await createModerationAuditLog(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        ModerationAuditLogStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });

    it("should throw BadRequestError if required field is missing", async () => {
      const input = getValidInput();
      delete input["logEntryType"];
      try {
        await createModerationAuditLog(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include(
          'Field "logEntryType" is required',
        );
      }
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with moderationAuditLog data", async () => {
      const input = getValidInput();
      await createModerationAuditLog(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = getValidInput();

      try {
        await createModerationAuditLog(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingModerationAuditLog",
        );
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
