const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createGdprDeleteRequest module", () => {
  let sandbox;
  let createGdprDeleteRequest;
  let GdprDeleteRequestStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const baseValidInput = {
    userId: "userId_val",
    status: "status_val",
  };
  const mockCreatedGdprDeleteRequest = {
    getData: () => ({ id: fakeId, ...baseValidInput }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprDeleteRequestStub = {
      create: sandbox.stub().resolves(mockCreatedGdprDeleteRequest),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createGdprDeleteRequest = proxyquire(
      "../../../../../src/db-layer/main/GdprDeleteRequest/utils/createGdprDeleteRequest",
      {
        models: { GdprDeleteRequest: GdprDeleteRequestStub },
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

  describe("createGdprDeleteRequest", () => {
    it("should create GdprDeleteRequest and index to elastic if valid data", async () => {
      const input = getValidInput();
      const result = await createGdprDeleteRequest(input);

      expect(result).to.deep.equal({ id: fakeId, ...baseValidInput });
      sinon.assert.calledOnce(GdprDeleteRequestStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);
    });

    it("should throw HttpServerError if GdprDeleteRequest.create fails", async () => {
      GdprDeleteRequestStub.create.rejects(new Error("DB error"));
      const input = getValidInput();

      try {
        await createGdprDeleteRequest(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingGdprDeleteRequest",
        );
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = getValidInput();
      delete input.id;
      await createGdprDeleteRequest(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = getValidInput({ id: "existing-id" });
      await createGdprDeleteRequest(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        GdprDeleteRequestStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is satisfied", async () => {
      const input = getValidInput();
      await createGdprDeleteRequest(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = getValidInput({ id: "custom-id" });
      await createGdprDeleteRequest(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        GdprDeleteRequestStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });

    it("should throw BadRequestError if required field is missing", async () => {
      const input = getValidInput();
      delete input["userId"];
      try {
        await createGdprDeleteRequest(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include('Field "userId" is required');
      }
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with gdprDeleteRequest data", async () => {
      const input = getValidInput();
      await createGdprDeleteRequest(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = getValidInput();

      try {
        await createGdprDeleteRequest(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingGdprDeleteRequest",
        );
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
