const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getGdprExportRequestByQuery module", () => {
  let sandbox;
  let getGdprExportRequestByQuery;
  let GdprExportRequestStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test GdprExportRequest",
    getData: () => ({ id: fakeId, name: "Test GdprExportRequest" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprExportRequestStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getGdprExportRequestByQuery = proxyquire(
      "../../../../../src/db-layer/main/GdprExportRequest/utils/getGdprExportRequestByQuery",
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

  describe("getGdprExportRequestByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getGdprExportRequestByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test GdprExportRequest",
      });
      sinon.assert.calledOnce(GdprExportRequestStub.findOne);
      sinon.assert.calledWith(GdprExportRequestStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      GdprExportRequestStub.findOne.resolves(null);

      const result = await getGdprExportRequestByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(GdprExportRequestStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getGdprExportRequestByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getGdprExportRequestByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      GdprExportRequestStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getGdprExportRequestByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprExportRequestByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      GdprExportRequestStub.findOne.resolves({ getData: () => undefined });

      const result = await getGdprExportRequestByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
