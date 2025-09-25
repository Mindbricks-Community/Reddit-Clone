const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createGdprExportRequest module", () => {
  let sandbox;
  let createGdprExportRequest;
  let GdprExportRequestStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const baseValidInput = {
    userId: "userId_val",
    status: "status_val",
  };
  const mockCreatedGdprExportRequest = {
    getData: () => ({ id: fakeId, ...baseValidInput }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprExportRequestStub = {
      create: sandbox.stub().resolves(mockCreatedGdprExportRequest),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createGdprExportRequest = proxyquire(
      "../../../../../src/db-layer/main/GdprExportRequest/utils/createGdprExportRequest",
      {
        models: { GdprExportRequest: GdprExportRequestStub },
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

  describe("createGdprExportRequest", () => {
    it("should create GdprExportRequest and index to elastic if valid data", async () => {
      const input = getValidInput();
      const result = await createGdprExportRequest(input);

      expect(result).to.deep.equal({ id: fakeId, ...baseValidInput });
      sinon.assert.calledOnce(GdprExportRequestStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);
    });

    it("should throw HttpServerError if GdprExportRequest.create fails", async () => {
      GdprExportRequestStub.create.rejects(new Error("DB error"));
      const input = getValidInput();

      try {
        await createGdprExportRequest(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingGdprExportRequest",
        );
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = getValidInput();
      delete input.id;
      await createGdprExportRequest(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = getValidInput({ id: "existing-id" });
      await createGdprExportRequest(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        GdprExportRequestStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is satisfied", async () => {
      const input = getValidInput();
      await createGdprExportRequest(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = getValidInput({ id: "custom-id" });
      await createGdprExportRequest(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        GdprExportRequestStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });

    it("should throw BadRequestError if required field is missing", async () => {
      const input = getValidInput();
      delete input["userId"];
      try {
        await createGdprExportRequest(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include('Field "userId" is required');
      }
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with gdprExportRequest data", async () => {
      const input = getValidInput();
      await createGdprExportRequest(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = getValidInput();

      try {
        await createGdprExportRequest(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingGdprExportRequest",
        );
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
