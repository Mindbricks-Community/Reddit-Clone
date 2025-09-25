const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//For these tests to work we need to export GetMediaObjectRestController also from file getmediaobject.js
describe("GetMediaObjectRestController", () => {
  let GetMediaObjectRestController, getMediaObject;
  let GetMediaObjectManagerStub, processRequestStub;
  let req, res, next;

  beforeEach(() => {
    req = { requestId: "req-456" };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();

    // Stub for GetMediaObjectManager constructor
    GetMediaObjectManagerStub = sinon.stub();

    // Stub for processRequest inherited from RestController
    processRequestStub = sinon.stub();

    // Proxyquire module under test with mocks
    ({ GetMediaObjectRestController, getMediaObject } = proxyquire(
      "../../../src/controllers-layer/rest-layer/main/mediaObject/get-mediaobject.js",
      {
        serviceCommon: {
          HexaLogTypes: {},
          hexaLogger: { insertInfo: sinon.stub(), insertError: sinon.stub() },
        },
        managers: {
          GetMediaObjectManager: GetMediaObjectManagerStub,
        },
        "../../MediaServiceRestController": class {
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

  describe("GetMediaObjectRestController class", () => {
    it("should extend RestController with correct values", () => {
      const controller = new GetMediaObjectRestController(req, res, next);

      expect(controller.name).to.equal("getMediaObject");
      expect(controller.routeName).to.equal("getmediaobject");
      expect(controller.dataName).to.equal("mediaObject");
      expect(controller.crudType).to.equal("get");
      expect(controller.status).to.equal(200);
      expect(controller.httpMethod).to.equal("GET");
    });

    it("should create GetMediaObjectManager in createApiManager()", () => {
      const controller = new GetMediaObjectRestController(req, res, next);
      controller._req = req;

      controller.createApiManager();

      expect(GetMediaObjectManagerStub.calledOnceWithExactly(req, "rest")).to.be
        .true;
    });
  });

  describe("getMediaObject function", () => {
    it("should create instance and call processRequest", async () => {
      await getMediaObject(req, res, next);

      expect(processRequestStub.calledOnce).to.be.true;
    });
  });
});
