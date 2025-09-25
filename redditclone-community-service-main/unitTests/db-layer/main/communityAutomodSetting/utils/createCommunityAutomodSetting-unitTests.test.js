const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createCommunityAutomodSetting module", () => {
  let sandbox;
  let createCommunityAutomodSetting;
  let CommunityAutomodSettingStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const baseValidInput = {
    communityId: "communityId_val",
    rulesData: "rulesData_val",
  };
  const mockCreatedCommunityAutomodSetting = {
    getData: () => ({ id: fakeId, ...baseValidInput }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityAutomodSettingStub = {
      create: sandbox.stub().resolves(mockCreatedCommunityAutomodSetting),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createCommunityAutomodSetting = proxyquire(
      "../../../../../src/db-layer/main/CommunityAutomodSetting/utils/createCommunityAutomodSetting",
      {
        models: { CommunityAutomodSetting: CommunityAutomodSettingStub },
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

  describe("createCommunityAutomodSetting", () => {
    it("should create CommunityAutomodSetting and index to elastic if valid data", async () => {
      const input = getValidInput();
      const result = await createCommunityAutomodSetting(input);

      expect(result).to.deep.equal({ id: fakeId, ...baseValidInput });
      sinon.assert.calledOnce(CommunityAutomodSettingStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);
    });

    it("should throw HttpServerError if CommunityAutomodSetting.create fails", async () => {
      CommunityAutomodSettingStub.create.rejects(new Error("DB error"));
      const input = getValidInput();

      try {
        await createCommunityAutomodSetting(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingCommunityAutomodSetting",
        );
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = getValidInput();
      delete input.id;
      await createCommunityAutomodSetting(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = getValidInput({ id: "existing-id" });
      await createCommunityAutomodSetting(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        CommunityAutomodSettingStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is satisfied", async () => {
      const input = getValidInput();
      await createCommunityAutomodSetting(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = getValidInput({ id: "custom-id" });
      await createCommunityAutomodSetting(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        CommunityAutomodSettingStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });

    it("should throw BadRequestError if required field is missing", async () => {
      const input = getValidInput();
      delete input["communityId"];
      try {
        await createCommunityAutomodSetting(input);
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
    it("should call ElasticIndexer with communityAutomodSetting data", async () => {
      const input = getValidInput();
      await createCommunityAutomodSetting(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = getValidInput();

      try {
        await createCommunityAutomodSetting(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingCommunityAutomodSetting",
        );
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
