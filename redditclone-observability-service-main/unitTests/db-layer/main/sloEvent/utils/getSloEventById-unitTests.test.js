const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getSloEventById module", () => {
  let sandbox;
  let getSloEventById;
  let SloEventStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test SloEvent" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    SloEventStub = {
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

    getSloEventById = proxyquire(
      "../../../../../src/db-layer/main/SloEvent/utils/getSloEventById",
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

  describe("getSloEventById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getSloEventById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(SloEventStub.findOne);
      sinon.assert.calledWith(
        SloEventStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getSloEventById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(SloEventStub.findAll);
      sinon.assert.calledWithMatch(SloEventStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      SloEventStub.findOne.resolves(null);
      const result = await getSloEventById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      SloEventStub.findAll.resolves([]);
      const result = await getSloEventById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      SloEventStub.findOne.rejects(new Error("DB failure"));
      try {
        await getSloEventById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingSloEventById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      SloEventStub.findAll.rejects(new Error("array failure"));
      try {
        await getSloEventById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingSloEventById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      SloEventStub.findOne.resolves({ getData: () => undefined });
      const result = await getSloEventById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      SloEventStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getSloEventById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
