const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getAdminUserActionByQuery module", () => {
  let sandbox;
  let getAdminUserActionByQuery;
  let AdminUserActionStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test AdminUserAction",
    getData: () => ({ id: fakeId, name: "Test AdminUserAction" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AdminUserActionStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getAdminUserActionByQuery = proxyquire(
      "../../../../../src/db-layer/main/AdminUserAction/utils/getAdminUserActionByQuery",
      {
        models: { AdminUserAction: AdminUserActionStub },
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
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getAdminUserActionByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getAdminUserActionByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test AdminUserAction",
      });
      sinon.assert.calledOnce(AdminUserActionStub.findOne);
      sinon.assert.calledWith(AdminUserActionStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      AdminUserActionStub.findOne.resolves(null);

      const result = await getAdminUserActionByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(AdminUserActionStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getAdminUserActionByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getAdminUserActionByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      AdminUserActionStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getAdminUserActionByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAdminUserActionByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      AdminUserActionStub.findOne.resolves({ getData: () => undefined });

      const result = await getAdminUserActionByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
