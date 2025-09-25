const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAutomodEventAggById module", () => {
  let sandbox;
  let getAutomodEventAggById;
  let AutomodEventStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AutomodEvent" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AutomodEventStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getAutomodEventAggById = proxyquire(
      "../../../../../src/db-layer/main/AutomodEvent/utils/getAutomodEventAggById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getAutomodEventAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getAutomodEventAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AutomodEventStub.findOne);
      sinon.assert.calledOnce(AutomodEventStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getAutomodEventAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AutomodEventStub.findAll);
      sinon.assert.calledOnce(AutomodEventStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      AutomodEventStub.findOne.resolves(null);
      const result = await getAutomodEventAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      AutomodEventStub.findAll.resolves([]);
      const result = await getAutomodEventAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      AutomodEventStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAutomodEventAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      AutomodEventStub.findOne.resolves({ getData: () => undefined });
      const result = await getAutomodEventAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      AutomodEventStub.findOne.rejects(new Error("fail"));
      try {
        await getAutomodEventAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAutomodEventAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      AutomodEventStub.findAll.rejects(new Error("all fail"));
      try {
        await getAutomodEventAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAutomodEventAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      AutomodEventStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getAutomodEventAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAutomodEventAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
