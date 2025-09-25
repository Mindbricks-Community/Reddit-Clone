const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getGdprExportRequestById module", () => {
  let sandbox;
  let getGdprExportRequestById;
  let GdprExportRequestStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test GdprExportRequest" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprExportRequestStub = {
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

    getGdprExportRequestById = proxyquire(
      "../../../../../src/db-layer/main/GdprExportRequest/utils/getGdprExportRequestById",
      {
        models: { GdprExportRequest: GdprExportRequestStub },
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

  describe("getGdprExportRequestById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getGdprExportRequestById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(GdprExportRequestStub.findOne);
      sinon.assert.calledWith(
        GdprExportRequestStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getGdprExportRequestById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(GdprExportRequestStub.findAll);
      sinon.assert.calledWithMatch(GdprExportRequestStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      GdprExportRequestStub.findOne.resolves(null);
      const result = await getGdprExportRequestById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      GdprExportRequestStub.findAll.resolves([]);
      const result = await getGdprExportRequestById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      GdprExportRequestStub.findOne.rejects(new Error("DB failure"));
      try {
        await getGdprExportRequestById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprExportRequestById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      GdprExportRequestStub.findAll.rejects(new Error("array failure"));
      try {
        await getGdprExportRequestById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprExportRequestById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      GdprExportRequestStub.findOne.resolves({ getData: () => undefined });
      const result = await getGdprExportRequestById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      GdprExportRequestStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getGdprExportRequestById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
