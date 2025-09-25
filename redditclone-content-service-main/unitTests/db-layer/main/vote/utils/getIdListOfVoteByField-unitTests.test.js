const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfVoteByField module", () => {
  let sandbox;
  let getIdListOfVoteByField;
  let VoteStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    VoteStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      userId: "example-type",
    };

    getIdListOfVoteByField = proxyquire(
      "../../../../../src/db-layer/main/Vote/utils/getIdListOfVoteByField",
      {
        models: { Vote: VoteStub },
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

  describe("getIdListOfVoteByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      VoteStub["userId"] = "string";
      const result = await getIdListOfVoteByField(
        "userId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(VoteStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      VoteStub["userId"] = "string";
      const result = await getIdListOfVoteByField("userId", "val", true);
      const call = VoteStub.findAll.getCall(0);
      expect(call.args[0].where["userId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfVoteByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      VoteStub["userId"] = 123; // expects number

      try {
        await getIdListOfVoteByField("userId", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      VoteStub.findAll.resolves([]);
      VoteStub["userId"] = "string";

      try {
        await getIdListOfVoteByField("userId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "Vote with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      VoteStub.findAll.rejects(new Error("query failed"));
      VoteStub["userId"] = "string";

      try {
        await getIdListOfVoteByField("userId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
