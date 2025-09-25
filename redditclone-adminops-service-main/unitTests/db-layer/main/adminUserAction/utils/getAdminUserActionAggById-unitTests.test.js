const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAdminUserActionAggById module", () => {
  let sandbox;
  let getAdminUserActionAggById;
  let AdminUserActionStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AdminUserAction" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AdminUserActionStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getAdminUserActionAggById = proxyquire(
      "../../../../../src/db-layer/main/AdminUserAction/utils/getAdminUserActionAggById",
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

  describe("getAdminUserActionAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getAdminUserActionAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AdminUserActionStub.findOne);
      sinon.assert.calledOnce(AdminUserActionStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getAdminUserActionAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AdminUserActionStub.findAll);
      sinon.assert.calledOnce(AdminUserActionStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      AdminUserActionStub.findOne.resolves(null);
      const result = await getAdminUserActionAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      AdminUserActionStub.findAll.resolves([]);
      const result = await getAdminUserActionAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      AdminUserActionStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAdminUserActionAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      AdminUserActionStub.findOne.resolves({ getData: () => undefined });
      const result = await getAdminUserActionAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      AdminUserActionStub.findOne.rejects(new Error("fail"));
      try {
        await getAdminUserActionAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAdminUserActionAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      AdminUserActionStub.findAll.rejects(new Error("all fail"));
      try {
        await getAdminUserActionAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAdminUserActionAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      AdminUserActionStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getAdminUserActionAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAdminUserActionAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
