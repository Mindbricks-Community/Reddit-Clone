const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

//For these tests to work we need to export GetAbuseReportRestController also from file getabusereport.js
describe("GetAbuseReportRestController", () => {
  let GetAbuseReportRestController, getAbuseReport;
  let GetAbuseReportManagerStub, processRequestStub;
  let req, res, next;

  beforeEach(() => {
    req = { requestId: "req-456" };
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
    };
    next = sinon.stub();

    // Stub for GetAbuseReportManager constructor
    GetAbuseReportManagerStub = sinon.stub();

    // Stub for processRequest inherited from RestController
    processRequestStub = sinon.stub();

    // Proxyquire module under test with mocks
    ({ GetAbuseReportRestController, getAbuseReport } = proxyquire(
      "../../../src/controllers-layer/rest-layer/main/abuseReport/get-abusereport.js",
      {
        serviceCommon: {
          HexaLogTypes: {},
          hexaLogger: { insertInfo: sinon.stub(), insertError: sinon.stub() },
        },
        managers: {
          GetAbuseReportManager: GetAbuseReportManagerStub,
        },
        "../../AbuseServiceRestController": class {
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

  describe("GetAbuseReportRestController class", () => {
    it("should extend RestController with correct values", () => {
      const controller = new GetAbuseReportRestController(req, res, next);

      expect(controller.name).to.equal("getAbuseReport");
      expect(controller.routeName).to.equal("getabusereport");
      expect(controller.dataName).to.equal("abuseReport");
      expect(controller.crudType).to.equal("get");
      expect(controller.status).to.equal(200);
      expect(controller.httpMethod).to.equal("GET");
    });

    it("should create GetAbuseReportManager in createApiManager()", () => {
      const controller = new GetAbuseReportRestController(req, res, next);
      controller._req = req;

      controller.createApiManager();

      expect(GetAbuseReportManagerStub.calledOnceWithExactly(req, "rest")).to.be
        .true;
    });
  });

  describe("getAbuseReport function", () => {
    it("should create instance and call processRequest", async () => {
      await getAbuseReport(req, res, next);

      expect(processRequestStub.calledOnce).to.be.true;
    });
  });
});
