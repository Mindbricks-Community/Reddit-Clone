const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createCommunityPinned module", () => {
  let sandbox;
  let createCommunityPinned;
  let CommunityPinnedStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const baseValidInput = {
    communityId: "communityId_val",
    targetType: "targetType_val",
    targetId: "targetId_val",
    orderIndex: "orderIndex_val",
  };
  const mockCreatedCommunityPinned = {
    getData: () => ({ id: fakeId, ...baseValidInput }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityPinnedStub = {
      create: sandbox.stub().resolves(mockCreatedCommunityPinned),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createCommunityPinned = proxyquire(
      "../../../../../src/db-layer/main/CommunityPinned/utils/createCommunityPinned",
      {
        models: { CommunityPinned: CommunityPinnedStub },
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

  describe("createCommunityPinned", () => {
    it("should create CommunityPinned and index to elastic if valid data", async () => {
      const input = getValidInput();
      const result = await createCommunityPinned(input);

      expect(result).to.deep.equal({ id: fakeId, ...baseValidInput });
      sinon.assert.calledOnce(CommunityPinnedStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);
    });

    it("should throw HttpServerError if CommunityPinned.create fails", async () => {
      CommunityPinnedStub.create.rejects(new Error("DB error"));
      const input = getValidInput();

      try {
        await createCommunityPinned(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingCommunityPinned",
        );
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = getValidInput();
      delete input.id;
      await createCommunityPinned(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = getValidInput({ id: "existing-id" });
      await createCommunityPinned(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        CommunityPinnedStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is satisfied", async () => {
      const input = getValidInput();
      await createCommunityPinned(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = getValidInput({ id: "custom-id" });
      await createCommunityPinned(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        CommunityPinnedStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });

    it("should throw BadRequestError if required field is missing", async () => {
      const input = getValidInput();
      delete input["communityId"];
      try {
        await createCommunityPinned(input);
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
    it("should call ElasticIndexer with communityPinned data", async () => {
      const input = getValidInput();
      await createCommunityPinned(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = getValidInput();

      try {
        await createCommunityPinned(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingCommunityPinned",
        );
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
