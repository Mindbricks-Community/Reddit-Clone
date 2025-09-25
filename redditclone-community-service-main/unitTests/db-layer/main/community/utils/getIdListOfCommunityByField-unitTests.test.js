const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfCommunityByField module", () => {
  let sandbox;
  let getIdListOfCommunityByField;
  let CommunityStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      name: "example-type",
    };

    getIdListOfCommunityByField = proxyquire(
      "../../../../../src/db-layer/main/Community/utils/getIdListOfCommunityByField",
      {
        models: { Community: CommunityStub },
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

  describe("getIdListOfCommunityByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      CommunityStub["name"] = "string";
      const result = await getIdListOfCommunityByField(
        "name",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(CommunityStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      CommunityStub["name"] = "string";
      const result = await getIdListOfCommunityByField("name", "val", true);
      const call = CommunityStub.findAll.getCall(0);
      expect(call.args[0].where["name"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfCommunityByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      CommunityStub["name"] = 123; // expects number

      try {
        await getIdListOfCommunityByField("name", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      CommunityStub.findAll.resolves([]);
      CommunityStub["name"] = "string";

      try {
        await getIdListOfCommunityByField("name", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "Community with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      CommunityStub.findAll.rejects(new Error("query failed"));
      CommunityStub["name"] = "string";

      try {
        await getIdListOfCommunityByField("name", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
