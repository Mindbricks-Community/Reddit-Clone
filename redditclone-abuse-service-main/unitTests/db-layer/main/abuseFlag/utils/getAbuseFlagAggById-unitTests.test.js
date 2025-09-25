const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAbuseFlagAggById module", () => {
  let sandbox;
  let getAbuseFlagAggById;
  let AbuseFlagStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AbuseFlag" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseFlagStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getAbuseFlagAggById = proxyquire(
      "../../../../../src/db-layer/main/AbuseFlag/utils/getAbuseFlagAggById",
      {
        models: { AbuseFlag: AbuseFlagStub },
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

  describe("getAbuseFlagAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getAbuseFlagAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AbuseFlagStub.findOne);
      sinon.assert.calledOnce(AbuseFlagStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getAbuseFlagAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AbuseFlagStub.findAll);
      sinon.assert.calledOnce(AbuseFlagStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      AbuseFlagStub.findOne.resolves(null);
      const result = await getAbuseFlagAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      AbuseFlagStub.findAll.resolves([]);
      const result = await getAbuseFlagAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      AbuseFlagStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAbuseFlagAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      AbuseFlagStub.findOne.resolves({ getData: () => undefined });
      const result = await getAbuseFlagAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      AbuseFlagStub.findOne.rejects(new Error("fail"));
      try {
        await getAbuseFlagAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseFlagAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      AbuseFlagStub.findAll.rejects(new Error("all fail"));
      try {
        await getAbuseFlagAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseFlagAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      AbuseFlagStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getAbuseFlagAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseFlagAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
