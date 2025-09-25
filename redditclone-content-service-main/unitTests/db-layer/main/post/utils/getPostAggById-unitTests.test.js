const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getPostAggById module", () => {
  let sandbox;
  let getPostAggById;
  let PostStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Post" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PostStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getPostAggById = proxyquire(
      "../../../../../src/db-layer/main/Post/utils/getPostAggById",
      {
        models: { Post: PostStub },
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

  describe("getPostAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getPostAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(PostStub.findOne);
      sinon.assert.calledOnce(PostStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getPostAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(PostStub.findAll);
      sinon.assert.calledOnce(PostStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      PostStub.findOne.resolves(null);
      const result = await getPostAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      PostStub.findAll.resolves([]);
      const result = await getPostAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      PostStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getPostAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      PostStub.findOne.resolves({ getData: () => undefined });
      const result = await getPostAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      PostStub.findOne.rejects(new Error("fail"));
      try {
        await getPostAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingPostAggById");
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      PostStub.findAll.rejects(new Error("all fail"));
      try {
        await getPostAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingPostAggById");
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      PostStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getPostAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingPostAggById");
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
