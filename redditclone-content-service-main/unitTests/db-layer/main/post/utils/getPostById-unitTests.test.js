const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getPostById module", () => {
  let sandbox;
  let getPostById;
  let PostStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test Post" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    PostStub = {
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

    getPostById = proxyquire(
      "../../../../../src/db-layer/main/Post/utils/getPostById",
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

  describe("getPostById", () => {
    it("should return getData() for single ID", async () => {
      const result = await getPostById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(PostStub.findOne);
      sinon.assert.calledWith(
        PostStub.findOne,
        sinon.match.has("where", sinon.match.has("id", fakeId)),
      );
    });

    it("should return mapped getData() results for array of IDs", async () => {
      const result = await getPostById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(PostStub.findAll);
      sinon.assert.calledWithMatch(PostStub.findAll, {
        where: { id: { [Op.in]: ["1", "2"] } },
      });
    });

    it("should return null if record not found (single ID)", async () => {
      PostStub.findOne.resolves(null);
      const result = await getPostById(fakeId);
      expect(result).to.be.null;
    });

    it("should return null if empty array returned from findAll", async () => {
      PostStub.findAll.resolves([]);
      const result = await getPostById(["a", "b"]);
      expect(result).to.deep.equal([]);
    });

    it("should wrap unexpected errors with HttpServerError (single ID)", async () => {
      PostStub.findOne.rejects(new Error("DB failure"));
      try {
        await getPostById("test");
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingPostById");
        expect(err.details.message).to.equal("DB failure");
      }
    });

    it("should wrap unexpected errors with HttpServerError (array of IDs)", async () => {
      PostStub.findAll.rejects(new Error("array failure"));
      try {
        await getPostById(["fail"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal("errMsg_dbErrorWhenRequestingPostById");
        expect(err.details.message).to.equal("array failure");
      }
    });

    it("should return undefined if getData() returns undefined", async () => {
      PostStub.findOne.resolves({ getData: () => undefined });
      const result = await getPostById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should return array of undefineds if getData() returns undefined per item", async () => {
      PostStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getPostById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });
  });
});
