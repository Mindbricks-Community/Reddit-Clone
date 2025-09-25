const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAlertById module", () => {
  let sandbox;
  let getAlertById;
  let AlertStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Alert" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AlertStub = {
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

    getAlertById = proxyquire(
      "../../../../../src/db-layer/main/Alert/utils/getAlertById",
      {
        models: { Alert: AlertStub },
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

  describe("getAlertById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getAlertById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AlertStub.findOne);
      sinon.assert.calledWith(
        AlertStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getAlertById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AlertStub.findAll);
      sinon.assert.calledWithMatch(AlertStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      AlertStub.findOne.resolves(null);
      const result = await getAlertById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      AlertStub.findAll.resolves([]);
      const result = await getAlertById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      AlertStub.findOne.rejects(new Error("DB failure"));
      try {
        await getAlertById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingAlertById");
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      AlertStub.findAll.rejects(new Error("array failure"));
      try {
        await getAlertById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingAlertById");
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      AlertStub.findOne.resolves({ getData: () => undefined });
      const result = await getAlertById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      AlertStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAlertById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
