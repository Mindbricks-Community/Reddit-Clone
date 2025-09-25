const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfGdprDeleteRequestByField module", () => {
  let sandbox;
  let getIdListOfGdprDeleteRequestByField;
  let GdprDeleteRequestStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprDeleteRequestStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      userId: "example-type",
    };

    getIdListOfGdprDeleteRequestByField = proxyquire(
      "../../../../../src/db-layer/main/GdprDeleteRequest/utils/getIdListOfGdprDeleteRequestByField",
      {
        models: { GdprDeleteRequest: GdprDeleteRequestStub },
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

  describe("getIdListOfGdprDeleteRequestByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      GdprDeleteRequestStub["userId"] = "string";
      const result = await getIdListOfGdprDeleteRequestByField(
        "userId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(GdprDeleteRequestStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      GdprDeleteRequestStub["userId"] = "string";
      const result = await getIdListOfGdprDeleteRequestByField(
        "userId",
        "val",
        true,
      );
      const call = GdprDeleteRequestStub.findAll.getCall(0);
      expect(call.args[0].where["userId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfGdprDeleteRequestByField(
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
      GdprDeleteRequestStub["userId"] = 123; // expects number

      try {
        await getIdListOfGdprDeleteRequestByField(
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
      GdprDeleteRequestStub.findAll.resolves([]);
      GdprDeleteRequestStub["userId"] = "string";

      try {
        await getIdListOfGdprDeleteRequestByField("userId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "GdprDeleteRequest with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      GdprDeleteRequestStub.findAll.rejects(new Error("query failed"));
      GdprDeleteRequestStub["userId"] = "string";

      try {
        await getIdListOfGdprDeleteRequestByField("userId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
