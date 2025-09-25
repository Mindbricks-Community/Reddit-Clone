const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getVoteAggById module", () => {
  let sandbox;
  let getVoteAggById;
  let VoteStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Vote" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    VoteStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getVoteAggById = proxyquire(
      "../../../../../src/db-layer/main/Vote/utils/getVoteAggById",
      {
        models: { Vote: VoteStub },
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

  describe("getVoteAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getVoteAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(VoteStub.findOne);
      sinon.assert.calledOnce(VoteStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getVoteAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(VoteStub.findAll);
      sinon.assert.calledOnce(VoteStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      VoteStub.findOne.resolves(null);
      const result = await getVoteAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      VoteStub.findAll.resolves([]);
      const result = await getVoteAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      VoteStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getVoteAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      VoteStub.findOne.resolves({ getData: () => undefined });
      const result = await getVoteAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      VoteStub.findOne.rejects(new Error("fail"));
      try {
        await getVoteAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingVoteAggById");
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      VoteStub.findAll.rejects(new Error("all fail"));
      try {
        await getVoteAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingVoteAggById");
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      VoteStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getVoteAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingVoteAggById");
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
