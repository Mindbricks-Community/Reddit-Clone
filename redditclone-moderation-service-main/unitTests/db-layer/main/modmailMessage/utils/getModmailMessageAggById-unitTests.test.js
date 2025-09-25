const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getModmailMessageAggById module", () => {
  let sandbox;
  let getModmailMessageAggById;
  let ModmailMessageStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test ModmailMessage" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModmailMessageStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getModmailMessageAggById = proxyquire(
      "../../../../../src/db-layer/main/ModmailMessage/utils/getModmailMessageAggById",
      {
        models: { ModmailMessage: ModmailMessageStub },
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

  describe("getModmailMessageAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getModmailMessageAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(ModmailMessageStub.findOne);
      sinon.assert.calledOnce(ModmailMessageStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getModmailMessageAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(ModmailMessageStub.findAll);
      sinon.assert.calledOnce(ModmailMessageStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      ModmailMessageStub.findOne.resolves(null);
      const result = await getModmailMessageAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      ModmailMessageStub.findAll.resolves([]);
      const result = await getModmailMessageAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      ModmailMessageStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getModmailMessageAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      ModmailMessageStub.findOne.resolves({ getData: () => undefined });
      const result = await getModmailMessageAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      ModmailMessageStub.findOne.rejects(new Error("fail"));
      try {
        await getModmailMessageAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModmailMessageAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      ModmailMessageStub.findAll.rejects(new Error("all fail"));
      try {
        await getModmailMessageAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModmailMessageAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      ModmailMessageStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getModmailMessageAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModmailMessageAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
