const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getGlobalUserRestrictionListByQuery module", () => {
  let sandbox;
  let getGlobalUserRestrictionListByQuery;
  let GlobalUserRestrictionStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GlobalUserRestrictionStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getGlobalUserRestrictionListByQuery = proxyquire(
      "../../../../../src/db-layer/main/GlobalUserRestriction/utils/getGlobalUserRestrictionListByQuery",
      {
        models: { GlobalUserRestriction: GlobalUserRestrictionStub },
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

  describe("getGlobalUserRestrictionListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getGlobalUserRestrictionListByQuery({
        isActive: true,
      });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(GlobalUserRestrictionStub.findAll);
      sinon.assert.calledWithMatch(GlobalUserRestrictionStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      GlobalUserRestrictionStub.findAll.resolves(null);

      const result = await getGlobalUserRestrictionListByQuery({
        active: false,
      });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      GlobalUserRestrictionStub.findAll.resolves([]);

      const result = await getGlobalUserRestrictionListByQuery({
        clientId: "xyz",
      });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      GlobalUserRestrictionStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getGlobalUserRestrictionListByQuery({
        active: true,
      });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getGlobalUserRestrictionListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getGlobalUserRestrictionListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      GlobalUserRestrictionStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getGlobalUserRestrictionListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGlobalUserRestrictionListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
