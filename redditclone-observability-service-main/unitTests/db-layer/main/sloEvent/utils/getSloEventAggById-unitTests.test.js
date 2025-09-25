const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getSloEventAggById module", () => {
  let sandbox;
  let getSloEventAggById;
  let SloEventStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test SloEvent" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    SloEventStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getSloEventAggById = proxyquire(
      "../../../../../src/db-layer/main/SloEvent/utils/getSloEventAggById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getSloEventAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getSloEventAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(SloEventStub.findOne);
      sinon.assert.calledOnce(SloEventStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getSloEventAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(SloEventStub.findAll);
      sinon.assert.calledOnce(SloEventStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      SloEventStub.findOne.resolves(null);
      const result = await getSloEventAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      SloEventStub.findAll.resolves([]);
      const result = await getSloEventAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      SloEventStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getSloEventAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      SloEventStub.findOne.resolves({ getData: () => undefined });
      const result = await getSloEventAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      SloEventStub.findOne.rejects(new Error("fail"));
      try {
        await getSloEventAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingSloEventAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      SloEventStub.findAll.rejects(new Error("all fail"));
      try {
        await getSloEventAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingSloEventAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      SloEventStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getSloEventAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingSloEventAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
