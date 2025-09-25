const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getGdprDeleteRequestListByQuery module", () => {
  let sandbox;
  let getGdprDeleteRequestListByQuery;
  let GdprDeleteRequestStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprDeleteRequestStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getGdprDeleteRequestListByQuery = proxyquire(
      "../../../../../src/db-layer/main/GdprDeleteRequest/utils/getGdprDeleteRequestListByQuery",
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

  describe("getGdprDeleteRequestListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getGdprDeleteRequestListByQuery({ isActive: true });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(GdprDeleteRequestStub.findAll);
      sinon.assert.calledWithMatch(GdprDeleteRequestStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      GdprDeleteRequestStub.findAll.resolves(null);

      const result = await getGdprDeleteRequestListByQuery({ active: false });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      GdprDeleteRequestStub.findAll.resolves([]);

      const result = await getGdprDeleteRequestListByQuery({ clientId: "xyz" });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      GdprDeleteRequestStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getGdprDeleteRequestListByQuery({ active: true });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getGdprDeleteRequestListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getGdprDeleteRequestListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      GdprDeleteRequestStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getGdprDeleteRequestListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprDeleteRequestListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
