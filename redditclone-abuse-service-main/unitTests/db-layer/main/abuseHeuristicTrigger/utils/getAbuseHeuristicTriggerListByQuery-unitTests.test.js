const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getAbuseHeuristicTriggerListByQuery module", () => {
  let sandbox;
  let getAbuseHeuristicTriggerListByQuery;
  let AbuseHeuristicTriggerStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    AbuseHeuristicTriggerStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getAbuseHeuristicTriggerListByQuery = proxyquire(
      "../../../../../src/db-layer/main/AbuseHeuristicTrigger/utils/getAbuseHeuristicTriggerListByQuery",
      {
        models: { AbuseHeuristicTrigger: AbuseHeuristicTriggerStub },
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

  describe("getAbuseHeuristicTriggerListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getAbuseHeuristicTriggerListByQuery({
        isActive: true,
      });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(AbuseHeuristicTriggerStub.findAll);
      sinon.assert.calledWithMatch(AbuseHeuristicTriggerStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      AbuseHeuristicTriggerStub.findAll.resolves(null);

      const result = await getAbuseHeuristicTriggerListByQuery({
        active: false,
      });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      AbuseHeuristicTriggerStub.findAll.resolves([]);

      const result = await getAbuseHeuristicTriggerListByQuery({
        clientId: "xyz",
      });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      AbuseHeuristicTriggerStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getAbuseHeuristicTriggerListByQuery({
        active: true,
      });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getAbuseHeuristicTriggerListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getAbuseHeuristicTriggerListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      AbuseHeuristicTriggerStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getAbuseHeuristicTriggerListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingAbuseHeuristicTriggerListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
