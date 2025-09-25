const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfModerationActionByField module", () => {
  let sandbox;
  let getIdListOfModerationActionByField;
  let ModerationActionStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationActionStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      communityId: "example-type",
    };

    getIdListOfModerationActionByField = proxyquire(
      "../../../../../src/db-layer/main/ModerationAction/utils/getIdListOfModerationActionByField",
      {
        models: { ModerationAction: ModerationActionStub },
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

  describe("getIdListOfModerationActionByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      ModerationActionStub["communityId"] = "string";
      const result = await getIdListOfModerationActionByField(
        "communityId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(ModerationActionStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      ModerationActionStub["communityId"] = "string";
      const result = await getIdListOfModerationActionByField(
        "communityId",
        "val",
        true,
      );
      const call = ModerationActionStub.findAll.getCall(0);
      expect(call.args[0].where["communityId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfModerationActionByField(
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
      ModerationActionStub["communityId"] = 123; // expects number

      try {
        await getIdListOfModerationActionByField(
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
      ModerationActionStub.findAll.resolves([]);
      ModerationActionStub["communityId"] = "string";

      try {
        await getIdListOfModerationActionByField(
          "communityId",
          "nomatch",
          false,
        );
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "ModerationAction with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      ModerationActionStub.findAll.rejects(new Error("query failed"));
      ModerationActionStub["communityId"] = "string";

      try {
        await getIdListOfModerationActionByField("communityId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
