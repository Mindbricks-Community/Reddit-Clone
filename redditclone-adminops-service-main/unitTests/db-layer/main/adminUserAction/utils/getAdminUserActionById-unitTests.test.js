const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAdminUserActionById module", () => {
  let sandbox;
  let getAdminUserActionById;
  let AdminUserActionStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AdminUserAction" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AdminUserActionStub = {
      findOne: sandbox.stub().resolves({
        getData: () => fakeData,
      }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
    };

    getAdminUserActionById = proxyquire(
      "../../../../../src/db-layer/main/AdminUserAction/utils/getAdminUserActionById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getAdminUserActionById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getAdminUserActionById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AdminUserActionStub.findOne);
      sinon.assert.calledWith(
        AdminUserActionStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getAdminUserActionById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AdminUserActionStub.findAll);
      sinon.assert.calledWithMatch(AdminUserActionStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      AdminUserActionStub.findOne.resolves(null);
      const result = await getAdminUserActionById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      AdminUserActionStub.findAll.resolves([]);
      const result = await getAdminUserActionById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      AdminUserActionStub.findOne.rejects(new Error("DB failure"));
      try {
        await getAdminUserActionById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAdminUserActionById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      AdminUserActionStub.findAll.rejects(new Error("array failure"));
      try {
        await getAdminUserActionById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAdminUserActionById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      AdminUserActionStub.findOne.resolves({ getData: () => undefined });
      const result = await getAdminUserActionById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      AdminUserActionStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAdminUserActionById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
