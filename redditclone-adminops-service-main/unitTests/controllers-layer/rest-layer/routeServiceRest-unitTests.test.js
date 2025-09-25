const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//For these tests to work we need to export GetAdminUserActionRestController also from file getadminuseraction.js
describe("GetAdminUserActionRestController", () => {
  let GetAdminUserActionRestController, getAdminUserAction;
  let GetAdminUserActionManagerStub, processRequestStub;
  let req, res, next;

  beforeEach(() => {
    req = { requestId: "req-456" };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();

    // Stub for GetAdminUserActionManager constructor
    GetAdminUserActionManagerStub = sinon.stub();

    // Stub for processRequest inherited from RestController
    processRequestStub = sinon.stub();

    // Proxyquire module under test with mocks
    ({ GetAdminUserActionRestController, getAdminUserAction } = proxyquire(
      "../../../src/controllers-layer/rest-layer/main/adminUserAction/get-adminuseraction.js",
      {
        serviceCommon: {
          HexaLogTypes: {},
          hexaLogger: { insertInfo: sinon.stub(), insertError: sinon.stub() },
        },
        managers: {
          GetAdminUserActionManager: GetAdminUserActionManagerStub,
        },
        "../../AdminOpsServiceRestController": class {
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

  describe("GetAdminUserActionRestController class", () => {
    it("should extend RestController with correct values", () => {
      const controller = new GetAdminUserActionRestController(req, res, next);

      expect(controller.name).to.equal("getAdminUserAction");
      expect(controller.routeName).to.equal("getadminuseraction");
      expect(controller.dataName).to.equal("adminUserAction");
      expect(controller.crudType).to.equal("get");
      expect(controller.status).to.equal(200);
      expect(controller.httpMethod).to.equal("GET");
    });

    it("should create GetAdminUserActionManager in createApiManager()", () => {
      const controller = new GetAdminUserActionRestController(req, res, next);
      controller._req = req;

      controller.createApiManager();

      expect(GetAdminUserActionManagerStub.calledOnceWithExactly(req, "rest"))
        .to.be.true;
    });
  });

  describe("getAdminUserAction function", () => {
    it("should create instance and call processRequest", async () => {
      await getAdminUserAction(req, res, next);

      expect(processRequestStub.calledOnce).to.be.true;
    });
  });
});
