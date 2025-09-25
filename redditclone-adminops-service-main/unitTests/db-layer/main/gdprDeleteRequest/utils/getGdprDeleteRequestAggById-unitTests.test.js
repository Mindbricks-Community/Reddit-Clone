const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getGdprDeleteRequestAggById module", () => {
  let sandbox;
  let getGdprDeleteRequestAggById;
  let GdprDeleteRequestStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test GdprDeleteRequest" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprDeleteRequestStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getGdprDeleteRequestAggById = proxyquire(
      "../../../../../src/db-layer/main/GdprDeleteRequest/utils/getGdprDeleteRequestAggById",
      {
        models: { GdprDeleteRequest: GdprDeleteRequestStub },
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

  describe("getGdprDeleteRequestAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getGdprDeleteRequestAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(GdprDeleteRequestStub.findOne);
      sinon.assert.calledOnce(GdprDeleteRequestStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getGdprDeleteRequestAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(GdprDeleteRequestStub.findAll);
      sinon.assert.calledOnce(GdprDeleteRequestStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      GdprDeleteRequestStub.findOne.resolves(null);
      const result = await getGdprDeleteRequestAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      GdprDeleteRequestStub.findAll.resolves([]);
      const result = await getGdprDeleteRequestAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      GdprDeleteRequestStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getGdprDeleteRequestAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      GdprDeleteRequestStub.findOne.resolves({ getData: () => undefined });
      const result = await getGdprDeleteRequestAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      GdprDeleteRequestStub.findOne.rejects(new Error("fail"));
      try {
        await getGdprDeleteRequestAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprDeleteRequestAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      GdprDeleteRequestStub.findAll.rejects(new Error("all fail"));
      try {
        await getGdprDeleteRequestAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprDeleteRequestAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      GdprDeleteRequestStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getGdprDeleteRequestAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprDeleteRequestAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
