const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfPostMediaByField module", () => {
  let sandbox;
  let getIdListOfPostMediaByField;
  let PostMediaStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PostMediaStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      mediaObjectId: "example-type",
    };

    getIdListOfPostMediaByField = proxyquire(
      "../../../../../src/db-layer/main/PostMedia/utils/getIdListOfPostMediaByField",
      {
        models: { PostMedia: PostMediaStub },
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

  describe("getIdListOfPostMediaByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      PostMediaStub["mediaObjectId"] = "string";
      const result = await getIdListOfPostMediaByField(
        "mediaObjectId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(PostMediaStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      PostMediaStub["mediaObjectId"] = "string";
      const result = await getIdListOfPostMediaByField(
        "mediaObjectId",
        "val",
        true,
      );
      const call = PostMediaStub.findAll.getCall(0);
      expect(call.args[0].where["mediaObjectId"][Op.contains]).to.include(
        "val",
      );
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfPostMediaByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      PostMediaStub["mediaObjectId"] = 123; // expects number

      try {
        await getIdListOfPostMediaByField("mediaObjectId", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      PostMediaStub.findAll.resolves([]);
      PostMediaStub["mediaObjectId"] = "string";

      try {
        await getIdListOfPostMediaByField("mediaObjectId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "PostMedia with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      PostMediaStub.findAll.rejects(new Error("query failed"));
      PostMediaStub["mediaObjectId"] = "string";

      try {
        await getIdListOfPostMediaByField("mediaObjectId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
