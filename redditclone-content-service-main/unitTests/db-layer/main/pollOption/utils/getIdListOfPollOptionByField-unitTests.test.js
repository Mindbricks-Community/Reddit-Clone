const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfPollOptionByField module", () => {
  let sandbox;
  let getIdListOfPollOptionByField;
  let PollOptionStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PollOptionStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      postId: "example-type",
    };

    getIdListOfPollOptionByField = proxyquire(
      "../../../../../src/db-layer/main/PollOption/utils/getIdListOfPollOptionByField",
      {
        models: { PollOption: PollOptionStub },
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

  describe("getIdListOfPollOptionByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      PollOptionStub["postId"] = "string";
      const result = await getIdListOfPollOptionByField(
        "postId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(PollOptionStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      PollOptionStub["postId"] = "string";
      const result = await getIdListOfPollOptionByField("postId", "val", true);
      const call = PollOptionStub.findAll.getCall(0);
      expect(call.args[0].where["postId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfPollOptionByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      PollOptionStub["postId"] = 123; // expects number

      try {
        await getIdListOfPollOptionByField("postId", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      PollOptionStub.findAll.resolves([]);
      PollOptionStub["postId"] = "string";

      try {
        await getIdListOfPollOptionByField("postId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "PollOption with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      PollOptionStub.findAll.rejects(new Error("query failed"));
      PollOptionStub["postId"] = "string";

      try {
        await getIdListOfPollOptionByField("postId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
