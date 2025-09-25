const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//For these tests to work we need to export GetModerationActionRestController also from file getmoderationaction.js
describe("GetModerationActionRestController", () => {
  let GetModerationActionRestController, getModerationAction;
  let GetModerationActionManagerStub, processRequestStub;
  let req, res, next;

  beforeEach(() => {
    req = { requestId: "req-456" };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();

    // Stub for GetModerationActionManager constructor
    GetModerationActionManagerStub = sinon.stub();

    // Stub for processRequest inherited from RestController
    processRequestStub = sinon.stub();

    // Proxyquire module under test with mocks
    ({ GetModerationActionRestController, getModerationAction } = proxyquire(
      "../../../src/controllers-layer/rest-layer/main/moderationAction/get-moderationaction.js",
      {
        serviceCommon: {
          HexaLogTypes: {},
          hexaLogger: { insertInfo: sinon.stub(), insertError: sinon.stub() },
        },
        managers: {
          GetModerationActionManager: GetModerationActionManagerStub,
        },
        "../../ModerationServiceRestController": class {
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

  describe("GetModerationActionRestController class", () => {
    it("should extend RestController with correct values", () => {
      const controller = new GetModerationActionRestController(req, res, next);

      expect(controller.name).to.equal("getModerationAction");
      expect(controller.routeName).to.equal("getmoderationaction");
      expect(controller.dataName).to.equal("moderationAction");
      expect(controller.crudType).to.equal("get");
      expect(controller.status).to.equal(200);
      expect(controller.httpMethod).to.equal("GET");
    });

    it("should create GetModerationActionManager in createApiManager()", () => {
      const controller = new GetModerationActionRestController(req, res, next);
      controller._req = req;

      controller.createApiManager();

      expect(GetModerationActionManagerStub.calledOnceWithExactly(req, "rest"))
        .to.be.true;
    });
  });

  describe("getModerationAction function", () => {
    it("should create instance and call processRequest", async () => {
      await getModerationAction(req, res, next);

      expect(processRequestStub.calledOnce).to.be.true;
    });
  });
});
