const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("updateCommunityAutomodSettingById module", () => {
  let sandbox;
  let updateCommunityAutomodSettingById;
  let CommunityAutomodSettingStub, ElasticIndexerStub;

  const fakeId = "uuid-123";
  const fakeUpdatedData = {
    id: fakeId,
    name: "Updated CommunityAutomodSetting",
  };
  const mockDbDoc = { getData: () => fakeUpdatedData };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityAutomodSettingStub = {
      findOne: sandbox.stub().resolves({ id: fakeId }),
      update: sandbox.stub().resolves([1, [mockDbDoc]]),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    updateCommunityAutomodSettingById = proxyquire(
      "../../../../../src/db-layer/main/CommunityAutomodSetting/utils/updateCommunityAutomodSettingById",
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
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
          hexaLogger: { insertError: sandbox.stub() },
        },
        sequelize: { Op: require("sequelize").Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("updateCommunityAutomodSettingById", () => {
    it("should update record by direct ID", async () => {
      const result = await updateCommunityAutomodSettingById(fakeId, {
        name: "Updated",
      });
      expect(result).to.deep.equal(fakeUpdatedData);
      sinon.assert.calledOnce(CommunityAutomodSettingStub.findOne);
      sinon.assert.calledOnce(CommunityAutomodSettingStub.update);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should extract ID from dataClause if not explicitly provided", async () => {
      const result = await updateCommunityAutomodSettingById(undefined, {
        id: fakeId,
        name: "Updated",
      });
      expect(result).to.deep.equal(fakeUpdatedData);
    });

    it("should support object-as-ID input", async () => {
      const result = await updateCommunityAutomodSettingById(
        { id: fakeId },
        { name: "Updated" },
      );
      expect(result).to.deep.equal(fakeUpdatedData);
    });

    it("should support object-as-only-input with ID and dataClause", async () => {
      const result = await updateCommunityAutomodSettingById({
        id: fakeId,
        name: "Updated",
      });
      expect(result).to.deep.equal(fakeUpdatedData);
    });

    it("should throw BadRequestError if no ID is provided", async () => {
      try {
        await updateCommunityAutomodSettingById(undefined, {});
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("ID is required");
      }
    });

    it("should throw NotFoundError if no existing record is found", async () => {
      CommunityAutomodSettingStub.findOne.resolves(null);
      try {
        await updateCommunityAutomodSettingById(fakeId, { name: "Updated" });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          `Record with ID ${fakeId} not found`,
        );
      }
    });

    it("should throw NotFoundError if update returns no record", async () => {
      CommunityAutomodSettingStub.update.resolves([0, []]);
      try {
        await updateCommunityAutomodSettingById(fakeId, { name: "Updated" });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include("Record not found for update");
      }
    });

    it("should throw HttpServerError if findOne fails", async () => {
      CommunityAutomodSettingStub.findOne.rejects(new Error("DB fail"));
      try {
        await updateCommunityAutomodSettingById(fakeId, { name: "Updated" });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("DB fail");
      }
    });

    it("should throw HttpServerError if update fails", async () => {
      CommunityAutomodSettingStub.update.rejects(new Error("update error"));
      try {
        await updateCommunityAutomodSettingById(fakeId, { name: "Updated" });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("update error");
      }
    });

    it("should throw HttpServerError if Elastic index fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("elastic error"));
      try {
        await updateCommunityAutomodSettingById(fakeId, { name: "Updated" });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("elastic error");
      }
    });
  });
});
