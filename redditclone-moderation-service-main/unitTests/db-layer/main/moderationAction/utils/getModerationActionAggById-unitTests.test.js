const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getModerationActionAggById module", () => {
  let sandbox;
  let getModerationActionAggById;
  let ModerationActionStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test ModerationAction" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationActionStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getModerationActionAggById = proxyquire(
      "../../../../../src/db-layer/main/ModerationAction/utils/getModerationActionAggById",
      {
        models: { ModerationAction: ModerationActionStub },
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

  describe("getModerationActionAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getModerationActionAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(ModerationActionStub.findOne);
      sinon.assert.calledOnce(ModerationActionStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getModerationActionAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(ModerationActionStub.findAll);
      sinon.assert.calledOnce(ModerationActionStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      ModerationActionStub.findOne.resolves(null);
      const result = await getModerationActionAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      ModerationActionStub.findAll.resolves([]);
      const result = await getModerationActionAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      ModerationActionStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getModerationActionAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      ModerationActionStub.findOne.resolves({ getData: () => undefined });
      const result = await getModerationActionAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      ModerationActionStub.findOne.rejects(new Error("fail"));
      try {
        await getModerationActionAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModerationActionAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      ModerationActionStub.findAll.rejects(new Error("all fail"));
      try {
        await getModerationActionAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModerationActionAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      ModerationActionStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getModerationActionAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModerationActionAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
