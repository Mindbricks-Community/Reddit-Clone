const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getGlobalUserRestrictionAggById module", () => {
  let sandbox;
  let getGlobalUserRestrictionAggById;
  let GlobalUserRestrictionStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test GlobalUserRestriction" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GlobalUserRestrictionStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getGlobalUserRestrictionAggById = proxyquire(
      "../../../../../src/db-layer/main/GlobalUserRestriction/utils/getGlobalUserRestrictionAggById",
      {
        models: { GlobalUserRestriction: GlobalUserRestrictionStub },
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

  describe("getGlobalUserRestrictionAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getGlobalUserRestrictionAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(GlobalUserRestrictionStub.findOne);
      sinon.assert.calledOnce(GlobalUserRestrictionStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getGlobalUserRestrictionAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(GlobalUserRestrictionStub.findAll);
      sinon.assert.calledOnce(GlobalUserRestrictionStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      GlobalUserRestrictionStub.findOne.resolves(null);
      const result = await getGlobalUserRestrictionAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      GlobalUserRestrictionStub.findAll.resolves([]);
      const result = await getGlobalUserRestrictionAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      GlobalUserRestrictionStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getGlobalUserRestrictionAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      GlobalUserRestrictionStub.findOne.resolves({ getData: () => undefined });
      const result = await getGlobalUserRestrictionAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      GlobalUserRestrictionStub.findOne.rejects(new Error("fail"));
      try {
        await getGlobalUserRestrictionAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGlobalUserRestrictionAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      GlobalUserRestrictionStub.findAll.rejects(new Error("all fail"));
      try {
        await getGlobalUserRestrictionAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGlobalUserRestrictionAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      GlobalUserRestrictionStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getGlobalUserRestrictionAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGlobalUserRestrictionAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
