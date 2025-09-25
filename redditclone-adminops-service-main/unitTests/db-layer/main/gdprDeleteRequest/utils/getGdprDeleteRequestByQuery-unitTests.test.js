const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getGdprDeleteRequestByQuery module", () => {
  let sandbox;
  let getGdprDeleteRequestByQuery;
  let GdprDeleteRequestStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test GdprDeleteRequest",
    getData: () => ({ id: fakeId, name: "Test GdprDeleteRequest" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GdprDeleteRequestStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getGdprDeleteRequestByQuery = proxyquire(
      "../../../../../src/db-layer/main/GdprDeleteRequest/utils/getGdprDeleteRequestByQuery",
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

  describe("getGdprDeleteRequestByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getGdprDeleteRequestByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test GdprDeleteRequest",
      });
      sinon.assert.calledOnce(GdprDeleteRequestStub.findOne);
      sinon.assert.calledWith(GdprDeleteRequestStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      GdprDeleteRequestStub.findOne.resolves(null);

      const result = await getGdprDeleteRequestByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(GdprDeleteRequestStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getGdprDeleteRequestByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getGdprDeleteRequestByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      GdprDeleteRequestStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getGdprDeleteRequestByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGdprDeleteRequestByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      GdprDeleteRequestStub.findOne.resolves({ getData: () => undefined });

      const result = await getGdprDeleteRequestByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
