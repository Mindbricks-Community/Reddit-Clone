const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("deleteModerationActionById module", () => {
  let sandbox;
  let deleteModerationActionById;
  let ModerationActionStub, ElasticIndexerStub;
  let mockDocInstance;

  const fakeId = "uuid-123";

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    mockDocInstance = {
      id: fakeId,
      update: sandbox.stub().resolves(),
      getData: () => ({ id: fakeId, name: "Deleted ModerationAction" }),
    };

    ModerationActionStub = {
      findOne: sandbox.stub().resolves(mockDocInstance),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      deleteData: sandbox.stub().resolves(),
    });

    deleteModerationActionById = proxyquire(
      "../../../../../src/db-layer/main/ModerationAction/utils/deleteModerationActionById",
      {
        models: { ModerationAction: ModerationActionStub },
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
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("deleteModerationActionById", () => {
    it("should delete ModerationAction and index removal in Elastic", async () => {
      const result = await deleteModerationActionById(fakeId);

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Deleted ModerationAction",
      });
      sinon.assert.calledWith(ModerationActionStub.findOne, {
        where: { id: fakeId, isActive: true },
      });
      sinon.assert.calledOnce(mockDocInstance.update);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledWith(ElasticIndexerStub().deleteData, fakeId);
    });

    it("should support object as ID input", async () => {
      const localMock = {
        id: fakeId,
        update: sandbox.stub().resolves(),
        getData: () => ({ id: fakeId, name: "Deleted ModerationAction" }),
      };
      ModerationActionStub.findOne.resolves(localMock);

      const result = await deleteModerationActionById({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Deleted ModerationAction",
      });
      sinon.assert.calledOnce(localMock.update);
    });

    it("should throw BadRequestError if no id is provided", async () => {
      try {
        await deleteModerationActionById(undefined);
        throw new Error("Expected to throw BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("ID is required");
      }
    });

    it("should throw NotFoundError if record is not found", async () => {
      ModerationActionStub.findOne.resolves(null);
      try {
        await deleteModerationActionById(fakeId);
        throw new Error("Expected to throw NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          `Record with ID ${fakeId} not found`,
        );
      }
    });

    it("should wrap internal errors with HttpServerError", async () => {
      ModerationActionStub.findOne.rejects(new Error("unexpected error"));

      try {
        await deleteModerationActionById(fakeId);
        throw new Error("Expected to throw HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("unexpected error");
      }
    });

    it("should wrap update() error with HttpServerError", async () => {
      mockDocInstance.update.rejects(new Error("update error"));

      try {
        await deleteModerationActionById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("update error");
      }
    });

    it("should wrap ElasticIndexer.deleteData() error with HttpServerError", async () => {
      mockDocInstance.update.resolves();
      ElasticIndexerStub().deleteData.rejects(new Error("elastic error"));

      const result = await deleteModerationActionById(fakeId).catch(
        (err) => err,
      );

      expect(result.name).to.equal("HttpServerError");
      expect(result.details.message).to.equal("elastic error");
    });

    it("should handle getData returning undefined gracefully", async () => {
      const localMock = {
        id: fakeId,
        update: sandbox.stub().resolves(),
        getData: () => undefined,
      };
      ModerationActionStub.findOne.resolves(localMock);

      const result = await deleteModerationActionById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should accept numeric ID as valid input", async () => {
      const numericId = 42;
      const localMock = {
        id: numericId,
        update: sandbox.stub().resolves(),
        getData: () => ({ id: numericId, name: "Deleted ModerationAction" }),
      };
      ModerationActionStub.findOne.resolves(localMock);

      const result = await deleteModerationActionById(numericId);
      expect(result).to.deep.equal({
        id: numericId,
        name: "Deleted ModerationAction",
      });
      sinon.assert.calledOnce(localMock.update);
    });
  });
});
