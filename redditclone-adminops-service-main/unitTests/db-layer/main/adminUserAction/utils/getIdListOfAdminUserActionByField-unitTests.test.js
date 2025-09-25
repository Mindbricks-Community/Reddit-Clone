const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfAdminUserActionByField module", () => {
  let sandbox;
  let getIdListOfAdminUserActionByField;
  let AdminUserActionStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AdminUserActionStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      adminId: "example-type",
    };

    getIdListOfAdminUserActionByField = proxyquire(
      "../../../../../src/db-layer/main/AdminUserAction/utils/getIdListOfAdminUserActionByField",
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
          NotFoundError: class NotFoundError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "NotFoundError";
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getIdListOfAdminUserActionByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      AdminUserActionStub["adminId"] = "string";
      const result = await getIdListOfAdminUserActionByField(
        "adminId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(AdminUserActionStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      AdminUserActionStub["adminId"] = "string";
      const result = await getIdListOfAdminUserActionByField(
        "adminId",
        "val",
        true,
      );
      const call = AdminUserActionStub.findAll.getCall(0);
      expect(call.args[0].where["adminId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfAdminUserActionByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      AdminUserActionStub["adminId"] = 123; // expects number

      try {
        await getIdListOfAdminUserActionByField("adminId", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      AdminUserActionStub.findAll.resolves([]);
      AdminUserActionStub["adminId"] = "string";

      try {
        await getIdListOfAdminUserActionByField("adminId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "AdminUserAction with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      AdminUserActionStub.findAll.rejects(new Error("query failed"));
      AdminUserActionStub["adminId"] = "string";

      try {
        await getIdListOfAdminUserActionByField("adminId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
