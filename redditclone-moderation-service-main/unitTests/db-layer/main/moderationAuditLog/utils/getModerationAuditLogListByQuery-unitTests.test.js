const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("getModerationAuditLogListByQuery module", () => {
  let sandbox;
  let getModerationAuditLogListByQuery;
  let ModerationAuditLogStub;

  const fakeList = [
    { getData: () => ({ id: "1", name: "Item 1" }) },
    { getData: () => ({ id: "2", name: "Item 2" }) },
  ];

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    ModerationAuditLogStub = {
      findAll: sandbox.stub().resolves(fakeList),
    };

    getModerationAuditLogListByQuery = proxyquire(
      "../../../../../src/db-layer/main/ModerationAuditLog/utils/getModerationAuditLogListByQuery",
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

  describe("getModerationAuditLogListByQuery", () => {
    it("should return list of getData() results if query is valid", async () => {
      const result = await getModerationAuditLogListByQuery({ isActive: true });

      expect(result).to.deep.equal([
        { id: "1", name: "Item 1" },
        { id: "2", name: "Item 2" },
      ]);

      sinon.assert.calledOnce(ModerationAuditLogStub.findAll);
      sinon.assert.calledWithMatch(ModerationAuditLogStub.findAll, {
        where: { isActive: true },
      });
    });

    it("should return [] if findAll returns null", async () => {
      ModerationAuditLogStub.findAll.resolves(null);

      const result = await getModerationAuditLogListByQuery({ active: false });
      expect(result).to.deep.equal([]);
    });

    it("should return [] if findAll returns empty array", async () => {
      ModerationAuditLogStub.findAll.resolves([]);

      const result = await getModerationAuditLogListByQuery({
        clientId: "xyz",
      });
      expect(result).to.deep.equal([]);
    });

    it("should return list of undefineds if getData() returns undefined", async () => {
      ModerationAuditLogStub.findAll.resolves([
        { getData: () => undefined },
        { getData: () => undefined },
      ]);

      const result = await getModerationAuditLogListByQuery({ active: true });
      expect(result).to.deep.equal([undefined, undefined]);
    });

    it("should throw BadRequestError if query is undefined", async () => {
      try {
        await getModerationAuditLogListByQuery(undefined);
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw BadRequestError if query is not an object", async () => {
      try {
        await getModerationAuditLogListByQuery("not-an-object");
        throw new Error("Expected BadRequestError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.details.name).to.equal("BadRequestError");
        expect(err.details.message).to.include("Invalid query");
      }
    });

    it("should throw HttpServerError if findAll fails", async () => {
      ModerationAuditLogStub.findAll.rejects(new Error("findAll failed"));

      try {
        await getModerationAuditLogListByQuery({ some: "query" });
        throw new Error("Expected HttpServerError");
      } catch (err) {
        expect(err.name).to.equal("HttpServerError");
        expect(err.message).to.equal(
          "errMsg_dbErrorWhenRequestingModerationAuditLogListByQuery",
        );
        expect(err.details.message).to.equal("findAll failed");
      }
    });
  });
});
