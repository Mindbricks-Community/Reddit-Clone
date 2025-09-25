const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCommunityMemberById module", () => {
  let sandbox;
  let getCommunityMemberById;
  let CommunityMemberStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test CommunityMember" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityMemberStub = {
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

    getCommunityMemberById = proxyquire(
      "../../../../../src/db-layer/main/CommunityMember/utils/getCommunityMemberById",
      {
        models: { CommunityMember: CommunityMemberStub },
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

  describe("getCommunityMemberById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getCommunityMemberById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CommunityMemberStub.findOne);
      sinon.assert.calledWith(
        CommunityMemberStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getCommunityMemberById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CommunityMemberStub.findAll);
      sinon.assert.calledWithMatch(CommunityMemberStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      CommunityMemberStub.findOne.resolves(null);
      const result = await getCommunityMemberById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      CommunityMemberStub.findAll.resolves([]);
      const result = await getCommunityMemberById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      CommunityMemberStub.findOne.rejects(new Error("DB failure"));
      try {
        await getCommunityMemberById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityMemberById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      CommunityMemberStub.findAll.rejects(new Error("array failure"));
      try {
        await getCommunityMemberById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityMemberById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      CommunityMemberStub.findOne.resolves({ getData: () => undefined });
      const result = await getCommunityMemberById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      CommunityMemberStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCommunityMemberById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
