const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCommentAggById module", () => {
  let sandbox;
  let getCommentAggById;
  let CommentStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Comment" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommentStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getCommentAggById = proxyquire(
      "../../../../../src/db-layer/main/Comment/utils/getCommentAggById",
      {
        models: { Comment: CommentStub },
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

  describe("getCommentAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getCommentAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CommentStub.findOne);
      sinon.assert.calledOnce(CommentStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getCommentAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CommentStub.findAll);
      sinon.assert.calledOnce(CommentStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      CommentStub.findOne.resolves(null);
      const result = await getCommentAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      CommentStub.findAll.resolves([]);
      const result = await getCommentAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      CommentStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCommentAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      CommentStub.findOne.resolves({ getData: () => undefined });
      const result = await getCommentAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      CommentStub.findOne.rejects(new Error("fail"));
      try {
        await getCommentAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommentAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      CommentStub.findAll.rejects(new Error("all fail"));
      try {
        await getCommentAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommentAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      CommentStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getCommentAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingCommentAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
