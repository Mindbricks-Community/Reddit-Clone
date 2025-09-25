const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCommunityAutomodSettingListByQuery module", () => {
  let sandbox;
  let getCommunityAutomodSettingListByQuery;
  let CommunityAutomodSettingStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityAutomodSettingStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getCommunityAutomodSettingListByQuery = proxyquire(
      "../../../../../src/db-layer/main/CommunityAutomodSetting/utils/getCommunityAutomodSettingListByQuery",
      {
        models: { CommunityAutomodSetting: CommunityAutomodSettingStub },
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

  describe("getCommunityAutomodSettingListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getCommunityAutomodSettingListByQuery({
        isActive: true,
      });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(CommunityAutomodSettingStub.findAll);
      sinon.assert.calledWithMatch(CommunityAutomodSettingStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      CommunityAutomodSettingStub.findAll.resolves(null);

      const result = await getCommunityAutomodSettingListByQuery({
        active: false,
      });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      CommunityAutomodSettingStub.findAll.resolves([]);

      const result = await getCommunityAutomodSettingListByQuery({
        clientId: "xyz",
      });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      CommunityAutomodSettingStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getCommunityAutomodSettingListByQuery({
        active: true,
      });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCommunityAutomodSettingListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCommunityAutomodSettingListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      CommunityAutomodSettingStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getCommunityAutomodSettingListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityAutomodSettingListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
