const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfPostByField module", () => {
  let sandbox;
  let getIdListOfPostByField;
  let PostStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PostStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      communityId: "example-type",
    };

    getIdListOfPostByField = proxyquire(
      "../../../../../src/db-layer/main/Post/utils/getIdListOfPostByField",
      {
        models: { Post: PostStub },
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

  describe("getIdListOfPostByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      PostStub["communityId"] = "string";
      const result = await getIdListOfPostByField(
        "communityId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(PostStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      PostStub["communityId"] = "string";
      const result = await getIdListOfPostByField("communityId", "val", true);
      const call = PostStub.findAll.getCall(0);
      expect(call.args[0].where["communityId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfPostByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      PostStub["communityId"] = 123; // expects number

      try {
        await getIdListOfPostByField("communityId", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      PostStub.findAll.resolves([]);
      PostStub["communityId"] = "string";

      try {
        await getIdListOfPostByField("communityId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "Post with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      PostStub.findAll.rejects(new Error("query failed"));
      PostStub["communityId"] = "string";

      try {
        await getIdListOfPostByField("communityId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
