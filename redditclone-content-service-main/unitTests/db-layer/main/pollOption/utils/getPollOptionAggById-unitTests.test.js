const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getPollOptionAggById module", () => {
  let sandbox;
  let getPollOptionAggById;
  let PollOptionStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test PollOption" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PollOptionStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getPollOptionAggById = proxyquire(
      "../../../../../src/db-layer/main/PollOption/utils/getPollOptionAggById",
      {
        models: { PollOption: PollOptionStub },
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

  describe("getPollOptionAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getPollOptionAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(PollOptionStub.findOne);
      sinon.assert.calledOnce(PollOptionStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getPollOptionAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(PollOptionStub.findAll);
      sinon.assert.calledOnce(PollOptionStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      PollOptionStub.findOne.resolves(null);
      const result = await getPollOptionAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      PollOptionStub.findAll.resolves([]);
      const result = await getPollOptionAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      PollOptionStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getPollOptionAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      PollOptionStub.findOne.resolves({ getData: () => undefined });
      const result = await getPollOptionAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      PollOptionStub.findOne.rejects(new Error("fail"));
      try {
        await getPollOptionAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPollOptionAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      PollOptionStub.findAll.rejects(new Error("all fail"));
      try {
        await getPollOptionAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPollOptionAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      PollOptionStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getPollOptionAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPollOptionAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
