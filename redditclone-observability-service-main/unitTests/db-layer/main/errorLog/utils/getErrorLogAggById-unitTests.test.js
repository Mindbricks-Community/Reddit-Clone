const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getErrorLogAggById module", () => {
  let sandbox;
  let getErrorLogAggById;
  let ErrorLogStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test ErrorLog" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ErrorLogStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getErrorLogAggById = proxyquire(
      "../../../../../src/db-layer/main/ErrorLog/utils/getErrorLogAggById",
      {
        models: { ErrorLog: ErrorLogStub },
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

  describe("getErrorLogAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getErrorLogAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(ErrorLogStub.findOne);
      sinon.assert.calledOnce(ErrorLogStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getErrorLogAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(ErrorLogStub.findAll);
      sinon.assert.calledOnce(ErrorLogStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      ErrorLogStub.findOne.resolves(null);
      const result = await getErrorLogAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      ErrorLogStub.findAll.resolves([]);
      const result = await getErrorLogAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      ErrorLogStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getErrorLogAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      ErrorLogStub.findOne.resolves({ getData: () => undefined });
      const result = await getErrorLogAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      ErrorLogStub.findOne.rejects(new Error("fail"));
      try {
        await getErrorLogAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingErrorLogAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      ErrorLogStub.findAll.rejects(new Error("all fail"));
      try {
        await getErrorLogAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingErrorLogAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      ErrorLogStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getErrorLogAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingErrorLogAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
