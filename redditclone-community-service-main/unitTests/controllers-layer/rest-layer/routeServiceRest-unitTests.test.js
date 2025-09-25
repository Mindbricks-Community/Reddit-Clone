const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//For these tests to work we need to export GetCommunityRestController also from file getcommunity.js
describe("GetCommunityRestController", () => {
  let GetCommunityRestController, getCommunity;
  let GetCommunityManagerStub, processRequestStub;
  let req, res, next;

  beforeEach(() => {
    req = { requestId: "req-456" };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();

    // Stub for GetCommunityManager constructor
    GetCommunityManagerStub = sinon.stub();

    // Stub for processRequest inherited from RestController
    processRequestStub = sinon.stub();

    // Proxyquire module under test with mocks
    ({ GetCommunityRestController, getCommunity } = proxyquire(
      "../../../src/controllers-layer/rest-layer/main/community/get-community.js",
      {
        serviceCommon: {
          HexaLogTypes: {},
          hexaLogger: { insertInfo: sinon.stub(), insertError: sinon.stub() },
        },
        managers: {
          GetCommunityManager: GetCommunityManagerStub,
        },
        "../../CommunityServiceRestController": class {
          constructor(name, routeName, _req, _res, _next) {
            this.name = name;
            this.routeName = routeName;
            this._req = _req;
            this._res = _res;
            this._next = _next;
            this.processRequest = processRequestStub;
          }
        },
      },
    ));
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("GetCommunityRestController class", () => {
    it("should extend RestController with correct values", () => {
      const controller = new GetCommunityRestController(req, res, next);

      expect(controller.name).to.equal("getCommunity");
      expect(controller.routeName).to.equal("getcommunity");
      expect(controller.dataName).to.equal("community");
      expect(controller.crudType).to.equal("get");
      expect(controller.status).to.equal(200);
      expect(controller.httpMethod).to.equal("GET");
    });

    it("should create GetCommunityManager in createApiManager()", () => {
      const controller = new GetCommunityRestController(req, res, next);
      controller._req = req;

      controller.createApiManager();

      expect(GetCommunityManagerStub.calledOnceWithExactly(req, "rest")).to.be
        .true;
    });
  });

  describe("getCommunity function", () => {
    it("should create instance and call processRequest", async () => {
      await getCommunity(req, res, next);

      expect(processRequestStub.calledOnce).to.be.true;
    });
  });
});
