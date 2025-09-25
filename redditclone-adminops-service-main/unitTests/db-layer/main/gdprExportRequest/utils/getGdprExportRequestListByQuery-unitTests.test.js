const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getGdprExportRequestListByQuery module", () => {
  let sandbox;
  let getGdprExportRequestListByQuery;
  let GdprExportRequestStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprExportRequestStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getGdprExportRequestListByQuery = proxyquire(
      "../../../../../src/db-layer/main/GdprExportRequest/utils/getGdprExportRequestListByQuery",
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
          BadRequestError: class BadRequestError extends Error {
            constructor(msg) {
              super(msg);
              this.name = "BadRequestError";
            }
          },
        },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getGdprExportRequestListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getGdprExportRequestListByQuery({ isActive: true });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(GdprExportRequestStub.findAll);
      sinon.assert.calledWithMatch(GdprExportRequestStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      GdprExportRequestStub.findAll.resolves(null);

      const result = await getGdprExportRequestListByQuery({ active: false });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      GdprExportRequestStub.findAll.resolves([]);

      const result = await getGdprExportRequestListByQuery({ clientId: "xyz" });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      GdprExportRequestStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getGdprExportRequestListByQuery({ active: true });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getGdprExportRequestListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getGdprExportRequestListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      GdprExportRequestStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getGdprExportRequestListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprExportRequestListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
