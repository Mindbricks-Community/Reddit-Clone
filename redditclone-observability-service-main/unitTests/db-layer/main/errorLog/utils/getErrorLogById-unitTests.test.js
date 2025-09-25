const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getErrorLogById module", () => {
  let sandbox;
  let getErrorLogById;
  let ErrorLogStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test ErrorLog" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ErrorLogStub = {
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

    getErrorLogById = proxyquire(
      "../../../../../src/db-layer/main/ErrorLog/utils/getErrorLogById",
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

  describe("getErrorLogById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getErrorLogById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(ErrorLogStub.findOne);
      sinon.assert.calledWith(
        ErrorLogStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getErrorLogById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(ErrorLogStub.findAll);
      sinon.assert.calledWithMatch(ErrorLogStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      ErrorLogStub.findOne.resolves(null);
      const result = await getErrorLogById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      ErrorLogStub.findAll.resolves([]);
      const result = await getErrorLogById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      ErrorLogStub.findOne.rejects(new Error("DB failure"));
      try {
        await getErrorLogById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingErrorLogById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      ErrorLogStub.findAll.rejects(new Error("array failure"));
      try {
        await getErrorLogById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingErrorLogById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      ErrorLogStub.findOne.resolves({ getData: () => undefined });
      const result = await getErrorLogById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      ErrorLogStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getErrorLogById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
