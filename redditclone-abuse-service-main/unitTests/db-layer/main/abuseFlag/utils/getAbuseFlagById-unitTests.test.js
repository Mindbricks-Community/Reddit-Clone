const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getAbuseFlagById module", () => {
  let sandbox;
  let getAbuseFlagById;
  let AbuseFlagStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test AbuseFlag" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseFlagStub = {
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

    getAbuseFlagById = proxyquire(
      "../../../../../src/db-layer/main/AbuseFlag/utils/getAbuseFlagById",
      {
        models: { AbuseFlag: AbuseFlagStub },
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

  describe("getAbuseFlagById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getAbuseFlagById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(AbuseFlagStub.findOne);
      sinon.assert.calledWith(
        AbuseFlagStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getAbuseFlagById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(AbuseFlagStub.findAll);
      sinon.assert.calledWithMatch(AbuseFlagStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      AbuseFlagStub.findOne.resolves(null);
      const result = await getAbuseFlagById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      AbuseFlagStub.findAll.resolves([]);
      const result = await getAbuseFlagById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      AbuseFlagStub.findOne.rejects(new Error("DB failure"));
      try {
        await getAbuseFlagById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseFlagById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      AbuseFlagStub.findAll.rejects(new Error("array failure"));
      try {
        await getAbuseFlagById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseFlagById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      AbuseFlagStub.findOne.resolves({ getData: () => undefined });
      const result = await getAbuseFlagById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      AbuseFlagStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getAbuseFlagById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
