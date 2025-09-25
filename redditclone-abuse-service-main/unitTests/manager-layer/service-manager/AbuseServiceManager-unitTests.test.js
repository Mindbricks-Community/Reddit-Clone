const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("AbuseServiceManager", () => {
  let AbuseServiceManager;
  let ApiManagerMock;

  beforeEach(() => {
    ApiManagerMock = class {
      constructor(req, opts) {
        this.request = req;
        this.options = opts;
        this.auth = req.auth;
      }

      parametersToJson(jsonObj) {
        jsonObj._base = true;
      }
    };

    AbuseServiceManager = proxyquire(
      "../../../src/manager-layer/service-manager/AbuseServiceManager",
      {
        "./ApiManager": ApiManagerMock,
      },
    );
  });

  describe("userHasRole()", () => {
    it("should return true if userHasRole returns true", () => {
      const req = {
        auth: {
          userHasRole: sinon.stub().withArgs("admin").returns(true),
        },
      };
      const manager = new AbuseServiceManager(req, {});
      expect(manager.userHasRole("admin")).to.be.true;
    });

    it("should return false if no auth", () => {
      const manager = new AbuseServiceManager({}, {});
      expect(manager.userHasRole("admin")).to.be.false;
    });
  });
});
