const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("createAdminUserAction module", () => {
  let sandbox;
  let createAdminUserAction;
  let AdminUserActionStub, ElasticIndexerStub, newUUIDStub;

  const fakeId = "uuid-123";
  const baseValidInput = {
    adminId: "adminId_val",
    targetType: "targetType_val",
    targetId: "targetId_val",
    actionType: "actionType_val",
  };
  const mockCreatedAdminUserAction = {
    getData: () => ({ id: fakeId, ...baseValidInput }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AdminUserActionStub = {
      create: sandbox.stub().resolves(mockCreatedAdminUserAction),
    };

    ElasticIndexerStub = sandbox.stub().returns({
      indexData: sandbox.stub().resolves(),
    });

    newUUIDStub = sandbox.stub().returns(fakeId);

    createAdminUserAction = proxyquire(
      "../../../../../src/db-layer/main/AdminUserAction/utils/createAdminUserAction",
      {
        models: { AdminUserAction: AdminUserActionStub },
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

  describe("createAdminUserAction", () => {
    it("should create AdminUserAction and index to elastic if valid data", async () => {
      const input = getValidInput();
      const result = await createAdminUserAction(input);

      expect(result).to.deep.equal({ id: fakeId, ...baseValidInput });
      sinon.assert.calledOnce(AdminUserActionStub.create);
      sinon.assert.calledOnce(ElasticIndexerStub);
    });

    it("should throw HttpServerError if AdminUserAction.create fails", async () => {
      AdminUserActionStub.create.rejects(new Error("DB error"));
      const input = getValidInput();

      try {
        await createAdminUserAction(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingAdminUserAction",
        );
        expect(err.details.message).to.equal("DB error");
      }
    });
  });

  describe("validateData", () => {
    it("should generate new UUID if id is not provided", async () => {
      const input = getValidInput();
      delete input.id;
      await createAdminUserAction(input);
      sinon.assert.calledOnce(newUUIDStub);
    });

    it("should use provided id if present", async () => {
      const input = getValidInput({ id: "existing-id" });
      await createAdminUserAction(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        AdminUserActionStub.create,
        sinon.match({ id: "existing-id" }),
      );
    });

    it("should not throw if requiredFields is satisfied", async () => {
      const input = getValidInput();
      await createAdminUserAction(input);
    });

    it("should not overwrite id if already present", async () => {
      const input = getValidInput({ id: "custom-id" });
      await createAdminUserAction(input);
      sinon.assert.notCalled(newUUIDStub);
      sinon.assert.calledWith(
        AdminUserActionStub.create,
        sinon.match({ id: "custom-id" }),
      );
    });

    it("should throw BadRequestError if required field is missing", async () => {
      const input = getValidInput();
      delete input["adminId"];
      try {
        await createAdminUserAction(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include('Field "adminId" is required');
      }
    });
  });

  describe("indexDataToElastic", () => {
    it("should call ElasticIndexer with adminUserAction data", async () => {
      const input = getValidInput();
      await createAdminUserAction(input);
      sinon.assert.calledOnce(ElasticIndexerStub);
      sinon.assert.calledOnce(ElasticIndexerStub().indexData);
    });

    it("should throw HttpServerError if ElasticIndexer.indexData fails", async () => {
      ElasticIndexerStub().indexData.rejects(new Error("Elastic error"));
      const input = getValidInput();

      try {
        await createAdminUserAction(input);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenCreatingAdminUserAction",
        );
        expect(err.details.message).to.equal("Elastic error");
      }
    });
  });
});
