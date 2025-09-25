const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getPostMediaAggById module", () => {
  let sandbox;
  let getPostMediaAggById;
  let PostMediaStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test PostMedia" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PostMediaStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getPostMediaAggById = proxyquire(
      "../../../../../src/db-layer/main/PostMedia/utils/getPostMediaAggById",
      {
        models: { PostMedia: PostMediaStub },
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

  describe("getPostMediaAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getPostMediaAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(PostMediaStub.findOne);
      sinon.assert.calledOnce(PostMediaStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getPostMediaAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(PostMediaStub.findAll);
      sinon.assert.calledOnce(PostMediaStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      PostMediaStub.findOne.resolves(null);
      const result = await getPostMediaAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      PostMediaStub.findAll.resolves([]);
      const result = await getPostMediaAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      PostMediaStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getPostMediaAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      PostMediaStub.findOne.resolves({ getData: () => undefined });
      const result = await getPostMediaAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      PostMediaStub.findOne.rejects(new Error("fail"));
      try {
        await getPostMediaAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPostMediaAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      PostMediaStub.findAll.rejects(new Error("all fail"));
      try {
        await getPostMediaAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPostMediaAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      PostMediaStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getPostMediaAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPostMediaAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
