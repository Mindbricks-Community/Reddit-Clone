const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getGdprExportRequestAggById module", () => {
  let sandbox;
  let getGdprExportRequestAggById;
  let GdprExportRequestStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test GdprExportRequest" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprExportRequestStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getGdprExportRequestAggById = proxyquire(
      "../../../../../src/db-layer/main/GdprExportRequest/utils/getGdprExportRequestAggById",
      {
        models: { GdprExportRequest: GdprExportRequestStub },
        common: {
          HttpServerError: class HttpServerError extends Error {
            constructor(msg, details) {
              super(msg);
              this.name = "HttpServerError";
              this.details = details;
            }
          },
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getGdprExportRequestAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getGdprExportRequestAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(GdprExportRequestStub.findOne);
      sinon.assert.calledOnce(GdprExportRequestStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getGdprExportRequestAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(GdprExportRequestStub.findAll);
      sinon.assert.calledOnce(GdprExportRequestStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      GdprExportRequestStub.findOne.resolves(null);
      const result = await getGdprExportRequestAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      GdprExportRequestStub.findAll.resolves([]);
      const result = await getGdprExportRequestAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      GdprExportRequestStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getGdprExportRequestAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      GdprExportRequestStub.findOne.resolves({ getData: () => undefined });
      const result = await getGdprExportRequestAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      GdprExportRequestStub.findOne.rejects(new Error("fail"));
      try {
        await getGdprExportRequestAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprExportRequestAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      GdprExportRequestStub.findAll.rejects(new Error("all fail"));
      try {
        await getGdprExportRequestAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprExportRequestAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      GdprExportRequestStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getGdprExportRequestAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprExportRequestAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
