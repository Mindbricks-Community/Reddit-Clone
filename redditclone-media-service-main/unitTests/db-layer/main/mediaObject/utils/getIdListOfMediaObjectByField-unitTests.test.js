const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfMediaObjectByField module", () => {
  let sandbox;
  let getIdListOfMediaObjectByField;
  let MediaObjectStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaObjectStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      ownerUserId: "example-type",
    };

    getIdListOfMediaObjectByField = proxyquire(
      "../../../../../src/db-layer/main/MediaObject/utils/getIdListOfMediaObjectByField",
      {
        models: { MediaObject: MediaObjectStub },
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

  describe("getIdListOfMediaObjectByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      MediaObjectStub["ownerUserId"] = "string";
      const result = await getIdListOfMediaObjectByField(
        "ownerUserId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(MediaObjectStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      MediaObjectStub["ownerUserId"] = "string";
      const result = await getIdListOfMediaObjectByField(
        "ownerUserId",
        "val",
        true,
      );
      const call = MediaObjectStub.findAll.getCall(0);
      expect(call.args[0].where["ownerUserId"][Op.contains]).to.include("val");
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfMediaObjectByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      MediaObjectStub["ownerUserId"] = 123; // expects number

      try {
        await getIdListOfMediaObjectByField("ownerUserId", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      MediaObjectStub.findAll.resolves([]);
      MediaObjectStub["ownerUserId"] = "string";

      try {
        await getIdListOfMediaObjectByField("ownerUserId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "MediaObject with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      MediaObjectStub.findAll.rejects(new Error("query failed"));
      MediaObjectStub["ownerUserId"] = "string";

      try {
        await getIdListOfMediaObjectByField("ownerUserId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
