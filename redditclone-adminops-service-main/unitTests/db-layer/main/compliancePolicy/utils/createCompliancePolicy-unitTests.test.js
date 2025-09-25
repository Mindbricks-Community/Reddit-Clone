const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createCompliancePolicy module", () => {
  let sandbox;
  let createCompliancePolicy;
  let CompliancePolicyStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const baseValidInput = {
    minAge: "minAge_val",
    gdprExportEnabled: "gdprExportEnabled_val",
    gdprDeleteEnabled: "gdprDeleteEnabled_val",
  };
  const mockCreatedCompliancePolicy = {
    getData: () => ({ id: fakeId, ...baseValidInput }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CompliancePolicyStub = {
      create: sandbox.stub().resolves(mockCreatedCompliancePolicy),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createCompliancePolicy = proxyquire(
      "../../../../../src/db-layer/main/CompliancePolicy/utils/createCompliancePolicy",
      {
        models: { CompliancePolicy: CompliancePolicyStub },
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

  describe("createCompliancePolicy", () => {
    it("should create CompliancePolicy and index to elastic if valid data", async () => {
      const input = getValidInput();
      const result = await createCompliancePolicy(input);

      expect(result).to.deep.equal({ id: fakeId, ...baseValidInput });
      sinon.assert.calledOnce(CompliancePolicyStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);
    });

    it("should throw HttpServerError if CompliancePolicy.create fails", async () => {
      CompliancePolicyStub.create.rejects(new Error("DB error"));
      const input = getValidInput();

      try {
        await createCompliancePolicy(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingCompliancePolicy",
        );
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = getValidInput();
      delete input.id;
      await createCompliancePolicy(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = getValidInput({ id: "existing-id" });
      await createCompliancePolicy(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        CompliancePolicyStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is satisfied", async () => {
      const input = getValidInput();
      await createCompliancePolicy(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = getValidInput({ id: "custom-id" });
      await createCompliancePolicy(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        CompliancePolicyStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });

    it("should throw BadRequestError if required field is missing", async () => {
      const input = getValidInput();
      delete input["minAge"];
      try {
        await createCompliancePolicy(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include('Field "minAge" is required');
      }
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with compliancePolicy data", async () => {
      const input = getValidInput();
      await createCompliancePolicy(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = getValidInput();

      try {
        await createCompliancePolicy(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingCompliancePolicy",
        );
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
