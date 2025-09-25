const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getPollOptionById module", () => {
  let sandbox;
  let getPollOptionById;
  let PollOptionStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test PollOption" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PollOptionStub = {
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

    getPollOptionById = proxyquire(
      "../../../../../src/db-layer/main/PollOption/utils/getPollOptionById",
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

  describe("getPollOptionById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getPollOptionById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(PollOptionStub.findOne);
      sinon.assert.calledWith(
        PollOptionStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getPollOptionById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(PollOptionStub.findAll);
      sinon.assert.calledWithMatch(PollOptionStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      PollOptionStub.findOne.resolves(null);
      const result = await getPollOptionById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      PollOptionStub.findAll.resolves([]);
      const result = await getPollOptionById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      PollOptionStub.findOne.rejects(new Error("DB failure"));
      try {
        await getPollOptionById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPollOptionById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      PollOptionStub.findAll.rejects(new Error("array failure"));
      try {
        await getPollOptionById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPollOptionById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      PollOptionStub.findOne.resolves({ getData: () => undefined });
      const result = await getPollOptionById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      PollOptionStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getPollOptionById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
