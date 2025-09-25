const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createAutomodEvent module", () => {
  let sandbox;
  let createAutomodEvent;
  let AutomodEventStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const baseValidInput = {
    communityId: "communityId_val",
    targetType: "targetType_val",
    targetId: "targetId_val",
    automodType: "automodType_val",
    performedByAutomod: "performedByAutomod_val",
  };
  const mockCreatedAutomodEvent = {
    getData: () => ({ id: fakeId, ...baseValidInput }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AutomodEventStub = {
      create: sandbox.stub().resolves(mockCreatedAutomodEvent),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createAutomodEvent = proxyquire(
      "../../../../../src/db-layer/main/AutomodEvent/utils/createAutomodEvent",
      {
        models: { AutomodEvent: AutomodEventStub },
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

  describe("createAutomodEvent", () => {
    it("should create AutomodEvent and index to elastic if valid data", async () => {
      const input = getValidInput();
      const result = await createAutomodEvent(input);

      expect(result).to.deep.equal({ id: fakeId, ...baseValidInput });
      sinon.assert.calledOnce(AutomodEventStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);
    });

    it("should throw HttpServerError if AutomodEvent.create fails", async () => {
      AutomodEventStub.create.rejects(new Error("DB error"));
      const input = getValidInput();

      try {
        await createAutomodEvent(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenCreatingAutomodEvent");
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = getValidInput();
      delete input.id;
      await createAutomodEvent(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = getValidInput({ id: "existing-id" });
      await createAutomodEvent(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        AutomodEventStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is satisfied", async () => {
      const input = getValidInput();
      await createAutomodEvent(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = getValidInput({ id: "custom-id" });
      await createAutomodEvent(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        AutomodEventStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });

    it("should throw BadRequestError if required field is missing", async () => {
      const input = getValidInput();
      delete input["communityId"];
      try {
        await createAutomodEvent(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include(
          'Field "communityId" is required',
        );
      }
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with automodEvent data", async () => {
      const input = getValidInput();
      await createAutomodEvent(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = getValidInput();

      try {
        await createAutomodEvent(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenCreatingAutomodEvent");
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
