const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("updateMediaScanById module", () => {
  let sandbox;
  let updateMediaScanById;
  let MediaScanStub, ElasticIndexerStub;

  const fakeId = "uuid-123";
  const fakeUpdatedData = { id: fakeId, name: "Updated MediaScan" };
  const mockDbDoc = { getData: () => fakeUpdatedData };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaScanStub = {
      findOne: sandbox.stub().resolves({ id: fakeId }),
      update: sandbox.stub().resolves([1, [mockDbDoc]]),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    updateMediaScanById = proxyquire(
      "../../../../../src/db-layer/main/MediaScan/utils/updateMediaScanById",
      {
        models: { MediaScan: MediaScanStub },
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

  describe("updateMediaScanById", () => {
    it("should update record by direct ID", async () => {
      const result = await updateMediaScanById(fakeId, { name: "Updated" });
      expect(result).to.deep.equal(fakeUpdatedData);
      sinon.assert.calledOnce(MediaScanStub.findOne);
      sinon.assert.calledOnce(MediaScanStub.update);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should extract ID from dataClause if not explicitly provided", async () => {
      const result = await updateMediaScanById(undefined, {
        id: fakeId,
        name: "Updated",
      });
      expect(result).to.deep.equal(fakeUpdatedData);
    });

    it("should support object-as-ID input", async () => {
      const result = await updateMediaScanById(
        { id: fakeId },
        { name: "Updated" },
      );
      expect(result).to.deep.equal(fakeUpdatedData);
    });

    it("should support object-as-only-input with ID and dataClause", async () => {
      const result = await updateMediaScanById({ id: fakeId, name: "Updated" });
      expect(result).to.deep.equal(fakeUpdatedData);
    });

    it("should throw BadRequestError if no ID is provided", async () => {
      try {
        await updateMediaScanById(undefined, {});
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("ID is required");
      }
    });

    it("should throw NotFoundError if no existing record is found", async () => {
      MediaScanStub.findOne.resolves(null);
      try {
        await updateMediaScanById(fakeId, { name: "Updated" });
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
      MediaScanStub.update.resolves([0, []]);
      try {
        await updateMediaScanById(fakeId, { name: "Updated" });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include("Record not found for update");
      }
    });

    it("should throw HttpServerError if findOne fails", async () => {
      MediaScanStub.findOne.rejects(new Error("DB fail"));
      try {
        await updateMediaScanById(fakeId, { name: "Updated" });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("DB fail");
      }
    });

    it("should throw HttpServerError if update fails", async () => {
      MediaScanStub.update.rejects(new Error("update error"));
      try {
        await updateMediaScanById(fakeId, { name: "Updated" });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("update error");
      }
    });

    it("should throw HttpServerError if Elastic index fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("elastic error"));
      try {
        await updateMediaScanById(fakeId, { name: "Updated" });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("elastic error");
      }
    });
  });
});
