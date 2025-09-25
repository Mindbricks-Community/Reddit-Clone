const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getGlobalUserRestrictionById module", () => {
  let sandbox;
  let getGlobalUserRestrictionById;
  let GlobalUserRestrictionStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test GlobalUserRestriction" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    GlobalUserRestrictionStub = {
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

    getGlobalUserRestrictionById = proxyquire(
      "../../../../../src/db-layer/main/GlobalUserRestriction/utils/getGlobalUserRestrictionById",
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
        },
        sequelize: { Op },
      },
    );
  });

  afterEach(() => sandbox.restore());

  describe("getGlobalUserRestrictionById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getGlobalUserRestrictionById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(GlobalUserRestrictionStub.findOne);
      sinon.assert.calledWith(
        GlobalUserRestrictionStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getGlobalUserRestrictionById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(GlobalUserRestrictionStub.findAll);
      sinon.assert.calledWithMatch(GlobalUserRestrictionStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      GlobalUserRestrictionStub.findOne.resolves(null);
      const result = await getGlobalUserRestrictionById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      GlobalUserRestrictionStub.findAll.resolves([]);
      const result = await getGlobalUserRestrictionById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      GlobalUserRestrictionStub.findOne.rejects(new Error("DB failure"));
      try {
        await getGlobalUserRestrictionById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGlobalUserRestrictionById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      GlobalUserRestrictionStub.findAll.rejects(new Error("array failure"));
      try {
        await getGlobalUserRestrictionById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingGlobalUserRestrictionById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      GlobalUserRestrictionStub.findOne.resolves({ getData: () => undefined });
      const result = await getGlobalUserRestrictionById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      GlobalUserRestrictionStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getGlobalUserRestrictionById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
