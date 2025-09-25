const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfGdprExportRequestByField module", () => {
  let sandbox;
  let getIdListOfGdprExportRequestByField;
  let GdprExportRequestStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprExportRequestStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      userId: "example-type",
    };

    getIdListOfGdprExportRequestByField = proxyquire(
      "../../../../../src/db-layer/main/GdprExportRequest/utils/getIdListOfGdprExportRequestByField",
      {
        models: { GdprExportRequest: GdprExportRequestStub },
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

  describe("getIdListOfGdprExportRequestByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      GdprExportRequestStub["userId"] = "string";
      const result = await getIdListOfGdprExportRequestByField(
        "userId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(GdprExportRequestStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      GdprExportRequestStub["userId"] = "string";
      const result = await getIdListOfGdprExportRequestByField(
        "userId",
        "val",
        true,
      );
      const call = GdprExportRequestStub.findAll.getCall(0);
      expect(call.args[0].where["userId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfGdprExportRequestByField(
          "nonexistentField",
          "x",
          false,
        );
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      GdprExportRequestStub["userId"] = 123; // expects number

      try {
        await getIdListOfGdprExportRequestByField(
          "userId",
          "wrong-type",
          false,
        );
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      GdprExportRequestStub.findAll.resolves([]);
      GdprExportRequestStub["userId"] = "string";

      try {
        await getIdListOfGdprExportRequestByField("userId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "GdprExportRequest with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      GdprExportRequestStub.findAll.rejects(new Error("query failed"));
      GdprExportRequestStub["userId"] = "string";

      try {
        await getIdListOfGdprExportRequestByField("userId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
