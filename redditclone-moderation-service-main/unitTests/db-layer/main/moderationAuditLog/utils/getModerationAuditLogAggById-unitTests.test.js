const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const { Op } = require("sequelize");

describe("getModerationAuditLogAggById module", () => {
  let sandbox;
  let getModerationAuditLogAggById;
  let ModerationAuditLogStub;

  const fakeId = "uuid-123";
  const fakeData = { id: fakeId, name: "Test ModerationAuditLog" };

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationAuditLogStub = {
      findOne: sandbox.stub().resolves({ getData: () => fakeData }),
      findAll: sandbox
        .stub()
        .resolves([
          { getData: () => ({ id: "1", name: "Item 1" }) },
          { getData: () => ({ id: "2", name: "Item 2" }) },
        ]),
      getCqrsJoins: sandbox.stub().resolves(),
    };

    getModerationAuditLogAggById = proxyquire(
      "../../../../../src/db-layer/main/ModerationAuditLog/utils/getModerationAuditLogAggById",
      {
        models: { ModerationAuditLog: ModerationAuditLogStub },
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

  describe("getModerationAuditLogAggById", () => {
    it("should return getData() with includes for single ID", async () => {
      const result = await getModerationAuditLogAggById(fakeId);
      expect(result).to.deep.equal(fakeData);
      sinon.assert.calledOnce(ModerationAuditLogStub.findOne);
      sinon.assert.calledOnce(ModerationAuditLogStub.getCqrsJoins);
    });

    it("should return mapped getData() for array of IDs", async () => {
      const result = await getModerationAuditLogAggById(["1", "2"]);
      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);
      sinon.assert.calledOnce(ModerationAuditLogStub.findAll);
      sinon.assert.calledOnce(ModerationAuditLogStub.getCqrsJoins);
    });

    it("should return null if not found for single ID", async () => {
      ModerationAuditLogStub.findOne.resolves(null);
      const result = await getModerationAuditLogAggById(fakeId);
      expect(result).to.equal(null);
    });

    it("should return empty array if input is array but no results", async () => {
      ModerationAuditLogStub.findAll.resolves([]);
      const result = await getModerationAuditLogAggById(["nope"]);
      expect(result).to.deep.equal([]);
    });

    it("should return undefined if getData returns undefined in array items", async () => {
      ModerationAuditLogStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);
      const result = await getModerationAuditLogAggById(["1", "2"]);
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should return undefined if getData returns undefined in single ID", async () => {
      ModerationAuditLogStub.findOne.resolves({ getData: () => undefined });
      const result = await getModerationAuditLogAggById(fakeId);
      expect(result).to.be.undefined;
    });

    it("should throw HttpServerError on unexpected error (findOne)", async () => {
      ModerationAuditLogStub.findOne.rejects(new Error("fail"));
      try {
        await getModerationAuditLogAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModerationAuditLogAggById",
        );
        expect(err.details.message).to.equal("fail");
      }
    });

    it("should throw HttpServerError on unexpected error (findAll)", async () => {
      ModerationAuditLogStub.findAll.rejects(new Error("all fail"));
      try {
        await getModerationAuditLogAggById(["1"]);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModerationAuditLogAggById",
        );
        expect(err.details.message).to.equal("all fail");
      }
    });

    it("should throw HttpServerError if getCqrsJoins fails", async () => {
      ModerationAuditLogStub.getCqrsJoins.rejects(new Error("joins fail"));
      try {
        await getModerationAuditLogAggById(fakeId);
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModerationAuditLogAggById",
        );
        expect(err.details.message).to.equal("joins fail");
      }
    });
  });
});
