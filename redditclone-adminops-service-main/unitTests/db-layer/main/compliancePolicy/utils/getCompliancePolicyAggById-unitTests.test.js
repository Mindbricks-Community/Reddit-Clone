const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCompliancePolicyAggById module", () => {
  let sandbox;
  let getCompliancePolicyAggById;
  let CompliancePolicyStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CompliancePolicy" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CompliancePolicyStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getCompliancePolicyAggById = proxyquire(
      "../../../../../src/db-layer/main/CompliancePolicy/utils/getCompliancePolicyAggById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getCompliancePolicyAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getCompliancePolicyAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CompliancePolicyStub.findOne);
      sinon.assert.calledOnce(CompliancePolicyStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getCompliancePolicyAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CompliancePolicyStub.findAll);
      sinon.assert.calledOnce(CompliancePolicyStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      CompliancePolicyStub.findOne.resolves(null);
      const result = await getCompliancePolicyAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      CompliancePolicyStub.findAll.resolves([]);
      const result = await getCompliancePolicyAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      CompliancePolicyStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCompliancePolicyAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      CompliancePolicyStub.findOne.resolves({ getData: () => undefined });
      const result = await getCompliancePolicyAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      CompliancePolicyStub.findOne.rejects(new Error("fail"));
      try {
        await getCompliancePolicyAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCompliancePolicyAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      CompliancePolicyStub.findAll.rejects(new Error("all fail"));
      try {
        await getCompliancePolicyAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCompliancePolicyAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      CompliancePolicyStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getCompliancePolicyAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCompliancePolicyAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
