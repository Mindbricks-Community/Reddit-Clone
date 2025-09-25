const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getCommunityAutomodSettingByQuery module", () => {
  let sandbox;
  let getCommunityAutomodSettingByQuery;
  let CommunityAutomodSettingStub;

  const fakeId = "uuid-123";
  const fakeRecord = {
    id: fakeId,
    name: "Test CommunityAutomodSetting",
    getData: () => ({ id: fakeId, name: "Test CommunityAutomodSetting" }),
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommunityAutomodSettingStub = {
      findOne: sandbox.stub().resolves(fakeRecord),
    };

    getCommunityAutomodSettingByQuery = proxyquire(
      "../../../../../src/db-layer/main/CommunityAutomodSetting/utils/getCommunityAutomodSettingByQuery",
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

  describe("getCommunityAutomodSettingByQuery", () => {
    it("should return the result of getData if found", async () => {
      const result = await getCommunityAutomodSettingByQuery({ id: fakeId });

      expect(result).to.deep.equal({
        id: fakeId,
        name: "Test CommunityAutomodSetting",
      });
      sinon.assert.calledOnce(CommunityAutomodSettingStub.findOne);
      sinon.assert.calledWith(CommunityAutomodSettingStub.findOne, {
        where: {
          id: fakeId,
          isActive: true,
        },
      });
    });

    it("should return null if no record is found", async () => {
      CommunityAutomodSettingStub.findOne.resolves(null);

      const result = await getCommunityAutomodSettingByQuery({ id: fakeId });

      expect(result).to.be.null;
      sinon.assert.calledOnce(CommunityAutomodSettingStub.findOne);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getCommunityAutomodSettingByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getCommunityAutomodSettingByQuery("invalid-query");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should wrap findOne errors in HttpServerError", async () => {
      CommunityAutomodSettingStub.findOne.rejects(new Error("findOne failed"));

      try {
        await getCommunityAutomodSettingByQuery({ test: true });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommunityAutomodSettingByQuery",
        );
        expect(err.details.message).to.equal("findOne failed");
      }
    });

    it("should return undefined if getData returns undefined", async () => {
      CommunityAutomodSettingStub.findOne.resolves({
        getData: () => undefined,
      });

      const result = await getCommunityAutomodSettingByQuery({ id: fakeId });

      expect(result).to.be.undefined;
    });
  });
});
