const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getVoteById module", () => {
  let sandbox;
  let getVoteById;
  let VoteStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Vote" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    VoteStub = {
      findOne: sandbox.stub().resolves({
        getData: () => fakeData,
      }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
    };

    getVoteById = proxyquire(
      "../../../../../src/db-layer/main/Vote/utils/getVoteById",
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

  describe("getVoteById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getVoteById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(VoteStub.findOne);
      sinon.assert.calledWith(
        VoteStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getVoteById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(VoteStub.findAll);
      sinon.assert.calledWithMatch(VoteStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      VoteStub.findOne.resolves(null);
      const result = await getVoteById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      VoteStub.findAll.resolves([]);
      const result = await getVoteById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      VoteStub.findOne.rejects(new Error("DB failure"));
      try {
        await getVoteById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingVoteById");
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      VoteStub.findAll.rejects(new Error("array failure"));
      try {
        await getVoteById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingVoteById");
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      VoteStub.findOne.resolves({ getData: () => undefined });
      const result = await getVoteById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      VoteStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getVoteById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
