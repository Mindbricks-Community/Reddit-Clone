const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAutomodEventById module", () => {
  let sandbox;
  let getAutomodEventById;
  let AutomodEventStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AutomodEvent" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AutomodEventStub = {
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

    getAutomodEventById = proxyquire(
      "../../../../../src/db-layer/main/AutomodEvent/utils/getAutomodEventById",
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

  describe("getAutomodEventById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getAutomodEventById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AutomodEventStub.findOne);
      sinon.assert.calledWith(
        AutomodEventStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getAutomodEventById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AutomodEventStub.findAll);
      sinon.assert.calledWithMatch(AutomodEventStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      AutomodEventStub.findOne.resolves(null);
      const result = await getAutomodEventById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      AutomodEventStub.findAll.resolves([]);
      const result = await getAutomodEventById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      AutomodEventStub.findOne.rejects(new Error("DB failure"));
      try {
        await getAutomodEventById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAutomodEventById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      AutomodEventStub.findAll.rejects(new Error("array failure"));
      try {
        await getAutomodEventById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAutomodEventById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      AutomodEventStub.findOne.resolves({ getData: () => undefined });
      const result = await getAutomodEventById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      AutomodEventStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAutomodEventById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
