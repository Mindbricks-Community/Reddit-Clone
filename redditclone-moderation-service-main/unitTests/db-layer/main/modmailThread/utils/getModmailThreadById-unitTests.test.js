const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getModmailThreadById module", () => {
  let sandbox;
  let getModmailThreadById;
  let ModmailThreadStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test ModmailThread" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModmailThreadStub = {
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

    getModmailThreadById = proxyquire(
      "../../../../../src/db-layer/main/ModmailThread/utils/getModmailThreadById",
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

  describe("getModmailThreadById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getModmailThreadById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(ModmailThreadStub.findOne);
      sinon.assert.calledWith(
        ModmailThreadStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getModmailThreadById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(ModmailThreadStub.findAll);
      sinon.assert.calledWithMatch(ModmailThreadStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      ModmailThreadStub.findOne.resolves(null);
      const result = await getModmailThreadById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      ModmailThreadStub.findAll.resolves([]);
      const result = await getModmailThreadById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      ModmailThreadStub.findOne.rejects(new Error("DB failure"));
      try {
        await getModmailThreadById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModmailThreadById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      ModmailThreadStub.findAll.rejects(new Error("array failure"));
      try {
        await getModmailThreadById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModmailThreadById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      ModmailThreadStub.findOne.resolves({ getData: () => undefined });
      const result = await getModmailThreadById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      ModmailThreadStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getModmailThreadById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
