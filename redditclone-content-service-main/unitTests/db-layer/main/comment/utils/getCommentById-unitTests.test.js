const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getCommentById module", () => {
  let sandbox;
  let getCommentById;
  let CommentStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Comment" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    CommentStub = {
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

    getCommentById = proxyquire(
      "../../../../../src/db-layer/main/Comment/utils/getCommentById",
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

  describe("getCommentById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getCommentById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(CommentStub.findOne);
      sinon.assert.calledWith(
        CommentStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getCommentById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(CommentStub.findAll);
      sinon.assert.calledWithMatch(CommentStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      CommentStub.findOne.resolves(null);
      const result = await getCommentById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      CommentStub.findAll.resolves([]);
      const result = await getCommentById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      CommentStub.findOne.rejects(new Error("DB failure"));
      try {
        await getCommentById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingCommentById");
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      CommentStub.findAll.rejects(new Error("array failure"));
      try {
        await getCommentById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingCommentById");
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      CommentStub.findOne.resolves({ getData: () => undefined });
      const result = await getCommentById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      CommentStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getCommentById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
