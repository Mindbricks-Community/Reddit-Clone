const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getIdListOfMediaScanByField module", () => {
  let sandbox;
  let getIdListOfMediaScanByField;
  let MediaScanStub;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    MediaScanStub = {
      findAll: sandbox.stub().resolves([{ id: "1" }, { id: "2" }]),
      mediaObjectId: "example-type",
    };

    getIdListOfMediaScanByField = proxyquire(
      "../../../../../src/db-layer/main/MediaScan/utils/getIdListOfMediaScanByField",
      {
        models: { MediaScan: MediaScanStub },
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

  describe("getIdListOfMediaScanByField", () => {
    it("should return list of IDs when valid field and value is given", async () => {
      MediaScanStub["mediaObjectId"] = "string";
      const result = await getIdListOfMediaScanByField(
        "mediaObjectId",
        "test-value",
        false,
      );
      expect(result).to.deep.equal(["1", "2"]);
      sinon.assert.calledOnce(MediaScanStub.findAll);
    });

    it("should return list of IDs using Op.contains if isArray is true", async () => {
      MediaScanStub["mediaObjectId"] = "string";
      const result = await getIdListOfMediaScanByField(
        "mediaObjectId",
        "val",
        true,
      );
      const call = MediaScanStub.findAll.getCall(0);
      expect(call.args[0].where["mediaObjectId"][Op.contains]).to.include(
        "val",
      );
    });

    it("should throw BadRequestError if field name is invalid", async () => {
      try {
        await getIdListOfMediaScanByField("nonexistentField", "x", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field name");
      }
    });

    it("should throw BadRequestError if field value has wrong type", async () => {
      MediaScanStub["mediaObjectId"] = 123; // expects number

      try {
        await getIdListOfMediaScanByField("mediaObjectId", "wrong-type", false);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid field value type");
      }
    });

    it("should throw NotFoundError if no records are found", async () => {
      MediaScanStub.findAll.resolves([]);
      MediaScanStub["mediaObjectId"] = "string";

      try {
        await getIdListOfMediaScanByField("mediaObjectId", "nomatch", false);
        throw new Error("Expected NotFoundError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("NotFoundError");
        expect(err.details.message).to.include(
          "MediaScan with the specified criteria not found",
        );
      }
    });

    it("should wrap findAll error in HttpServerError", async () => {
      MediaScanStub.findAll.rejects(new Error("query failed"));
      MediaScanStub["mediaObjectId"] = "string";

      try {
        await getIdListOfMediaScanByField("mediaObjectId", "test", false);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.message).to.equal("query failed");
      }
    });
  });
});
