const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getGdprDeleteRequestById module", () => {
  let sandbox;
  let getGdprDeleteRequestById;
  let GdprDeleteRequestStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test GdprDeleteRequest" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprDeleteRequestStub = {
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

    getGdprDeleteRequestById = proxyquire(
      "../../../../../src/db-layer/main/GdprDeleteRequest/utils/getGdprDeleteRequestById",
      {
        models: { GdprDeleteRequest: GdprDeleteRequestStub },
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

  describe("getGdprDeleteRequestById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getGdprDeleteRequestById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(GdprDeleteRequestStub.findOne);
      sinon.assert.calledWith(
        GdprDeleteRequestStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getGdprDeleteRequestById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(GdprDeleteRequestStub.findAll);
      sinon.assert.calledWithMatch(GdprDeleteRequestStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      GdprDeleteRequestStub.findOne.resolves(null);
      const result = await getGdprDeleteRequestById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      GdprDeleteRequestStub.findAll.resolves([]);
      const result = await getGdprDeleteRequestById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      GdprDeleteRequestStub.findOne.rejects(new Error("DB failure"));
      try {
        await getGdprDeleteRequestById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprDeleteRequestById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      GdprDeleteRequestStub.findAll.rejects(new Error("array failure"));
      try {
        await getGdprDeleteRequestById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprDeleteRequestById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      GdprDeleteRequestStub.findOne.resolves({ getData: () => undefined });
      const result = await getGdprDeleteRequestById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      GdprDeleteRequestStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getGdprDeleteRequestById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
