const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getModmailThreadAggById module", () => {
  let sandbox;
  let getModmailThreadAggById;
  let ModmailThreadStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test ModmailThread" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModmailThreadStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getModmailThreadAggById = proxyquire(
      "../../../../../src/db-layer/main/ModmailThread/utils/getModmailThreadAggById",
      {
        models: { ModmailThread: ModmailThreadStub },
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

  describe("getModmailThreadAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getModmailThreadAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(ModmailThreadStub.findOne);
      sinon.assert.calledOnce(ModmailThreadStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getModmailThreadAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(ModmailThreadStub.findAll);
      sinon.assert.calledOnce(ModmailThreadStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      ModmailThreadStub.findOne.resolves(null);
      const result = await getModmailThreadAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      ModmailThreadStub.findAll.resolves([]);
      const result = await getModmailThreadAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      ModmailThreadStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getModmailThreadAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      ModmailThreadStub.findOne.resolves({ getData: () => undefined });
      const result = await getModmailThreadAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      ModmailThreadStub.findOne.rejects(new Error("fail"));
      try {
        await getModmailThreadAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModmailThreadAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      ModmailThreadStub.findAll.rejects(new Error("all fail"));
      try {
        await getModmailThreadAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModmailThreadAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      ModmailThreadStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getModmailThreadAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModmailThreadAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
