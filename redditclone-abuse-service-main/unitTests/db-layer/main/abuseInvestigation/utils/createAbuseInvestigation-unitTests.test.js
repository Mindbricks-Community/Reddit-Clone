const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createAbuseInvestigation module", () => {
  let sandbox;
  let createAbuseInvestigation;
  let AbuseInvestigationStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const baseValidInput = {
    investigationStatus: "investigationStatus_val",
    title: "title_val",
    openedByUserId: "openedByUserId_val",
  };
  const mockCreatedAbuseInvestigation = {
    getData: () => ({ id: fakeId, ...baseValidInput }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseInvestigationStub = {
      create: sandbox.stub().resolves(mockCreatedAbuseInvestigation),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createAbuseInvestigation = proxyquire(
      "../../../../../src/db-layer/main/AbuseInvestigation/utils/createAbuseInvestigation",
      {
        models: { AbuseInvestigation: AbuseInvestigationStub },
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

  describe("createAbuseInvestigation", () => {
    it("should create AbuseInvestigation and index to elastic if valid data", async () => {
      const input = getValidInput();
      const result = await createAbuseInvestigation(input);

      expect(result).to.deep.equal({ id: fakeId, ...baseValidInput });
      sinon.assert.calledOnce(AbuseInvestigationStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);
    });

    it("should throw HttpServerError if AbuseInvestigation.create fails", async () => {
      AbuseInvestigationStub.create.rejects(new Error("DB error"));
      const input = getValidInput();

      try {
        await createAbuseInvestigation(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingAbuseInvestigation",
        );
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = getValidInput();
      delete input.id;
      await createAbuseInvestigation(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = getValidInput({ id: "existing-id" });
      await createAbuseInvestigation(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        AbuseInvestigationStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is satisfied", async () => {
      const input = getValidInput();
      await createAbuseInvestigation(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = getValidInput({ id: "custom-id" });
      await createAbuseInvestigation(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        AbuseInvestigationStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });

    it("should throw BadRequestError if required field is missing", async () => {
      const input = getValidInput();
      delete input["investigationStatus"];
      try {
        await createAbuseInvestigation(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include(
          'Field "investigationStatus" is required',
        );
      }
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with abuseInvestigation data", async () => {
      const input = getValidInput();
      await createAbuseInvestigation(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = getValidInput();

      try {
        await createAbuseInvestigation(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingAbuseInvestigation",
        );
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
