const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfModmailThreadByField module", () => {
  let sandbox;
  let getIdListOfModmailThreadByField;
  let ModmailThreadStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModmailThreadStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      communityId: "example-type",
    };

    getIdListOfModmailThreadByField = proxyquire(
      "../../../../../src/db-layer/main/ModmailThread/utils/getIdListOfModmailThreadByField",
      {
        models: { ModmailThread: ModmailThreadStub },
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

  describe("getIdListOfModmailThreadByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      ModmailThreadStub["communityId"] = "string";
      const result = await getIdListOfModmailThreadByField(
        "communityId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(ModmailThreadStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      ModmailThreadStub["communityId"] = "string";
      const result = await getIdListOfModmailThreadByField(
        "communityId",
        "val",
        true,
      );
      const call = ModmailThreadStub.findAll.getCall(0);
      expect(call.args[0].where["communityId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfModmailThreadByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      ModmailThreadStub["communityId"] = 123; // expects number

      try {
        await getIdListOfModmailThreadByField(
          "communityId",
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
      ModmailThreadStub.findAll.resolves([]);
      ModmailThreadStub["communityId"] = "string";

      try {
        await getIdListOfModmailThreadByField("communityId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "ModmailThread with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      ModmailThreadStub.findAll.rejects(new Error("query failed"));
      ModmailThreadStub["communityId"] = "string";

      try {
        await getIdListOfModmailThreadByField("communityId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
