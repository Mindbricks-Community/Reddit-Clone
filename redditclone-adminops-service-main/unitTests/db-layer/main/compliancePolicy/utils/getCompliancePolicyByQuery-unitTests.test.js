const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCompliancePolicyByQuery module", () => {
  let sandbox;
  let getCompliancePolicyByQuery;
  let CompliancePolicyStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test CompliancePolicy",
    getData: () => ({ id: fakeId, name: "Test CompliancePolicy" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CompliancePolicyStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getCompliancePolicyByQuery = proxyquire(
      "../../../../../src/db-layer/main/CompliancePolicy/utils/getCompliancePolicyByQuery",
      {
        models: { CompliancePolicy: CompliancePolicyStub },
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

  describe("getCompliancePolicyByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getCompliancePolicyByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test CompliancePolicy",
      });
      sinon.assert.calledOnce(CompliancePolicyStub.findOne);
      sinon.assert.calledWith(CompliancePolicyStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      CompliancePolicyStub.findOne.resolves(null);

      const result = await getCompliancePolicyByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(CompliancePolicyStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCompliancePolicyByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCompliancePolicyByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      CompliancePolicyStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getCompliancePolicyByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCompliancePolicyByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      CompliancePolicyStub.findOne.resolves({ getData: () => undefined });

      const result = await getCompliancePolicyByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
