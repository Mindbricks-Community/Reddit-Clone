const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfSloEventByField module", () => {
  let sandbox;
  let getIdListOfSloEventByField;
  let SloEventStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    SloEventStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      eventTime: "example-type",
    };

    getIdListOfSloEventByField = proxyquire(
      "../../../../../src/db-layer/main/SloEvent/utils/getIdListOfSloEventByField",
      {
        models: { SloEvent: SloEventStub },
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

  describe("getIdListOfSloEventByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      SloEventStub["eventTime"] = "string";
      const result = await getIdListOfSloEventByField(
        "eventTime",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(SloEventStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      SloEventStub["eventTime"] = "string";
      const result = await getIdListOfSloEventByField("eventTime", "val", true);
      const call = SloEventStub.findAll.getCall(0);
      expect(call.args[0].where["eventTime"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfSloEventByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      SloEventStub["eventTime"] = 123; // expects number

      try {
        await getIdListOfSloEventByField("eventTime", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      SloEventStub.findAll.resolves([]);
      SloEventStub["eventTime"] = "string";

      try {
        await getIdListOfSloEventByField("eventTime", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "SloEvent with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      SloEventStub.findAll.rejects(new Error("query failed"));
      SloEventStub["eventTime"] = "string";

      try {
        await getIdListOfSloEventByField("eventTime", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
