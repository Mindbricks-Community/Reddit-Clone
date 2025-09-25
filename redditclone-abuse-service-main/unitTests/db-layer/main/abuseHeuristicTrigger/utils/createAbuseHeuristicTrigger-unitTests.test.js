const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createAbuseHeuristicTrigger module", () => {
  let sandbox;
  let createAbuseHeuristicTrigger;
  let AbuseHeuristicTriggerStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const baseValidInput = {
    triggerType: "triggerType_val",
  };
  const mockCreatedAbuseHeuristicTrigger = {
    getData: () => ({ id: fakeId, ...baseValidInput }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseHeuristicTriggerStub = {
      create: sandbox.stub().resolves(mockCreatedAbuseHeuristicTrigger),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createAbuseHeuristicTrigger = proxyquire(
      "../../../../../src/db-layer/main/AbuseHeuristicTrigger/utils/createAbuseHeuristicTrigger",
      {
        models: { AbuseHeuristicTrigger: AbuseHeuristicTriggerStub },
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

  describe("createAbuseHeuristicTrigger", () => {
    it("should create AbuseHeuristicTrigger and index to elastic if valid data", async () => {
      const input = getValidInput();
      const result = await createAbuseHeuristicTrigger(input);

      expect(result).to.deep.equal({ id: fakeId, ...baseValidInput });
      sinon.assert.calledOnce(AbuseHeuristicTriggerStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);
    });

    it("should throw HttpServerError if AbuseHeuristicTrigger.create fails", async () => {
      AbuseHeuristicTriggerStub.create.rejects(new Error("DB error"));
      const input = getValidInput();

      try {
        await createAbuseHeuristicTrigger(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingAbuseHeuristicTrigger",
        );
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = getValidInput();
      delete input.id;
      await createAbuseHeuristicTrigger(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = getValidInput({ id: "existing-id" });
      await createAbuseHeuristicTrigger(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        AbuseHeuristicTriggerStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is satisfied", async () => {
      const input = getValidInput();
      await createAbuseHeuristicTrigger(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = getValidInput({ id: "custom-id" });
      await createAbuseHeuristicTrigger(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        AbuseHeuristicTriggerStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });

    it("should throw BadRequestError if required field is missing", async () => {
      const input = getValidInput();
      delete input["triggerType"];
      try {
        await createAbuseHeuristicTrigger(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include(
          'Field "triggerType" is required',
        );
      }
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with abuseHeuristicTrigger data", async () => {
      const input = getValidInput();
      await createAbuseHeuristicTrigger(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = getValidInput();

      try {
        await createAbuseHeuristicTrigger(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingAbuseHeuristicTrigger",
        );
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
