const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getPostMediaById module", () => {
  let sandbox;
  let getPostMediaById;
  let PostMediaStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test PostMedia" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PostMediaStub = {
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

    getPostMediaById = proxyquire(
      "../../../../../src/db-layer/main/PostMedia/utils/getPostMediaById",
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

  describe("getPostMediaById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getPostMediaById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(PostMediaStub.findOne);
      sinon.assert.calledWith(
        PostMediaStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getPostMediaById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(PostMediaStub.findAll);
      sinon.assert.calledWithMatch(PostMediaStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      PostMediaStub.findOne.resolves(null);
      const result = await getPostMediaById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      PostMediaStub.findAll.resolves([]);
      const result = await getPostMediaById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      PostMediaStub.findOne.rejects(new Error("DB failure"));
      try {
        await getPostMediaById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPostMediaById",
        );
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      PostMediaStub.findAll.rejects(new Error("array failure"));
      try {
        await getPostMediaById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingPostMediaById",
        );
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      PostMediaStub.findOne.resolves({ getData: () => undefined });
      const result = await getPostMediaById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      PostMediaStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getPostMediaById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
