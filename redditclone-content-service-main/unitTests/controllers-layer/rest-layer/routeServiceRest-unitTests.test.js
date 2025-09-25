const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//For these tests to work we need to export GetPostRestController also from file getpost.js
describe("GetPostRestController", () => {
  let GetPostRestController, getPost;
  let GetPostManagerStub, processRequestStub;
  let req, res, next;

  beforeEach(() => {
    req = { requestId: "req-456" };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();

    // Stub for GetPostManager constructor
    GetPostManagerStub = sinon.stub();

    // Stub for processRequest inherited from RestController
    processRequestStub = sinon.stub();

    // Proxyquire module under test with mocks
    ({ GetPostRestController, getPost } = proxyquire(
      "../../../src/controllers-layer/rest-layer/main/post/get-post.js",
      {
        serviceCommon: {
          HexaLogTypes: {},
          hexaLogger: { insertInfo: sinon.stub(), insertError: sinon.stub() },
        },
        managers: {
          GetPostManager: GetPostManagerStub,
        },
        "../../ContentServiceRestController": class {
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

  describe("GetPostRestController class", () => {
    it("should extend RestController with correct values", () => {
      const controller = new GetPostRestController(req, res, next);

      expect(controller.name).to.equal("getPost");
      expect(controller.routeName).to.equal("getpost");
      expect(controller.dataName).to.equal("post");
      expect(controller.crudType).to.equal("get");
      expect(controller.status).to.equal(200);
      expect(controller.httpMethod).to.equal("GET");
    });

    it("should create GetPostManager in createApiManager()", () => {
      const controller = new GetPostRestController(req, res, next);
      controller._req = req;

      controller.createApiManager();

      expect(GetPostManagerStub.calledOnceWithExactly(req, "rest")).to.be.true;
    });
  });

  describe("getPost function", () => {
    it("should create instance and call processRequest", async () => {
      await getPost(req, res, next);

      expect(processRequestStub.calledOnce).to.be.true;
    });
  });
});
