const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfCommentByField module", () => {
  let sandbox;
  let getIdListOfCommentByField;
  let CommentStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommentStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      postId: "example-type",
    };

    getIdListOfCommentByField = proxyquire(
      "../../../../../src/db-layer/main/Comment/utils/getIdListOfCommentByField",
      {
        models: { Comment: CommentStub },
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

  describe("getIdListOfCommentByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      CommentStub["postId"] = "string";
      const result = await getIdListOfCommentByField(
        "postId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(CommentStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      CommentStub["postId"] = "string";
      const result = await getIdListOfCommentByField("postId", "val", true);
      const call = CommentStub.findAll.getCall(0);
      expect(call.args[0].where["postId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfCommentByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      CommentStub["postId"] = 123; // expects number

      try {
        await getIdListOfCommentByField("postId", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      CommentStub.findAll.resolves([]);
      CommentStub["postId"] = "string";

      try {
        await getIdListOfCommentByField("postId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "Comment with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      CommentStub.findAll.rejects(new Error("query failed"));
      CommentStub["postId"] = "string";

      try {
        await getIdListOfCommentByField("postId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
