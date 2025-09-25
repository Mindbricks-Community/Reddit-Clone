const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getAbuseInvestigationListByQuery module", () => {
  let sandbox;
  let getAbuseInvestigationListByQuery;
  let AbuseInvestigationStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseInvestigationStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getAbuseInvestigationListByQuery = proxyquire(
      "../../../../../src/db-layer/main/AbuseInvestigation/utils/getAbuseInvestigationListByQuery",
      {
        models: { AbuseInvestigation: AbuseInvestigationStub },
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

  describe("getAbuseInvestigationListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getAbuseInvestigationListByQuery({ isActive: true });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(AbuseInvestigationStub.findAll);
      sinon.assert.calledWithMatch(AbuseInvestigationStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      AbuseInvestigationStub.findAll.resolves(null);

      const result = await getAbuseInvestigationListByQuery({ active: false });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      AbuseInvestigationStub.findAll.resolves([]);

      const result = await getAbuseInvestigationListByQuery({
        clientId: "xyz",
      });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      AbuseInvestigationStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getAbuseInvestigationListByQuery({ active: true });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getAbuseInvestigationListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getAbuseInvestigationListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      AbuseInvestigationStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getAbuseInvestigationListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseInvestigationListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
