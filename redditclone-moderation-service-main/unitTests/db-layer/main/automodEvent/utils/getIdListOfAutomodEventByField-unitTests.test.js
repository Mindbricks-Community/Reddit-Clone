const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfAutomodEventByField module", () => {
  let sandbox;
  let getIdListOfAutomodEventByField;
  let AutomodEventStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AutomodEventStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      communityId: "example-type",
    };

    getIdListOfAutomodEventByField = proxyquire(
      "../../../../../src/db-layer/main/AutomodEvent/utils/getIdListOfAutomodEventByField",
      {
        models: { AutomodEvent: AutomodEventStub },
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

  describe("getIdListOfAutomodEventByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      AutomodEventStub["communityId"] = "string";
      const result = await getIdListOfAutomodEventByField(
        "communityId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(AutomodEventStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      AutomodEventStub["communityId"] = "string";
      const result = await getIdListOfAutomodEventByField(
        "communityId",
        "val",
        true,
      );
      const call = AutomodEventStub.findAll.getCall(0);
      expect(call.args[0].where["communityId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfAutomodEventByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      AutomodEventStub["communityId"] = 123; // expects number

      try {
        await getIdListOfAutomodEventByField(
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
      AutomodEventStub.findAll.resolves([]);
      AutomodEventStub["communityId"] = "string";

      try {
        await getIdListOfAutomodEventByField("communityId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "AutomodEvent with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      AutomodEventStub.findAll.rejects(new Error("query failed"));
      AutomodEventStub["communityId"] = "string";

      try {
        await getIdListOfAutomodEventByField("communityId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
