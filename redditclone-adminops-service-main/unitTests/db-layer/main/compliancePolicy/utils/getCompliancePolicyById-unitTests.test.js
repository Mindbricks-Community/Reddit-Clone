const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCompliancePolicyById module", () => {
  let sandbox;
  let getCompliancePolicyById;
  let CompliancePolicyStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CompliancePolicy" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CompliancePolicyStub = {
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

    getCompliancePolicyById = proxyquire(
      "../../../../../src/db-layer/main/CompliancePolicy/utils/getCompliancePolicyById",
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

  describe("getCompliancePolicyById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getCompliancePolicyById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CompliancePolicyStub.findOne);
      sinon.assert.calledWith(
        CompliancePolicyStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getCompliancePolicyById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CompliancePolicyStub.findAll);
      sinon.assert.calledWithMatch(CompliancePolicyStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      CompliancePolicyStub.findOne.resolves(null);
      const result = await getCompliancePolicyById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      CompliancePolicyStub.findAll.resolves([]);
      const result = await getCompliancePolicyById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      CompliancePolicyStub.findOne.rejects(new Error("DB failure"));
      try {
        await getCompliancePolicyById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCompliancePolicyById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      CompliancePolicyStub.findAll.rejects(new Error("array failure"));
      try {
        await getCompliancePolicyById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCompliancePolicyById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      CompliancePolicyStub.findOne.resolves({ getData: () => undefined });
      const result = await getCompliancePolicyById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      CompliancePolicyStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCompliancePolicyById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
