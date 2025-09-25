const GdprDeleteRequestManager = require("./GdprDeleteRequestManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateGdprdeleterequest } = require("dbLayer");

class CreateGdprDeleteRequestManager extends GdprDeleteRequestManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createGdprDeleteRequest",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "gdprDeleteRequest";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.userId = this.userId;
    jsonObj.requestedByAdminId = this.requestedByAdminId;
    jsonObj.status = this.status;
    jsonObj.errorMsg = this.errorMsg;
  }

  readRestParameters(request) {
    this.userId = request.body?.userId;
    this.requestedByAdminId = request.body?.requestedByAdminId;
    this.status = request.body?.status;
    this.errorMsg = request.body?.errorMsg;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.userId = request.mcpParams.userId;
    this.requestedByAdminId = request.mcpParams.requestedByAdminId;
    this.status = request.mcpParams.status;
    this.errorMsg = request.mcpParams.errorMsg;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.userId == null) {
      throw new BadRequestError("errMsg_userIdisRequired");
    }

    if (this.status == null) {
      throw new BadRequestError("errMsg_statusisRequired");
    }

    // ID
    if (
      this.userId &&
      !isValidObjectId(this.userId) &&
      !isValidUUID(this.userId)
    ) {
      throw new BadRequestError("errMsg_userIdisNotAValidID");
    }

    // ID
    if (
      this.requestedByAdminId &&
      !isValidObjectId(this.requestedByAdminId) &&
      !isValidUUID(this.requestedByAdminId)
    ) {
      throw new BadRequestError("errMsg_requestedByAdminIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.gdprDeleteRequest?._owner === this.session.userId;
  }

  checkAbsolute() {
    // Check if user has an absolute role to ignore all authorization validations and return
    if (this.userHasRole(this.ROLES.admin)) {
      this.absoluteAuth = true;
      return true;
    }
    return false;
  }

  async checkLayer1AuthValidations() {
    //check "403" validations

    // Validation Check: routeRoleCheck
    // Check if the logged in user has [admin] roles
    if (!this.userHasRole(this.ROLES.admin)) {
      throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
    }
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateGdprdeleterequest function to create the gdprdeleterequest and return the result to the controller
    const gdprdeleterequest = await dbCreateGdprdeleterequest(this);

    return gdprdeleterequest;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.gdprDeleteRequestId = this.id;
    if (!this.gdprDeleteRequestId) this.gdprDeleteRequestId = newUUID(false);

    const dataClause = {
      id: this.gdprDeleteRequestId,
      userId: this.userId,
      requestedByAdminId: this.requestedByAdminId,
      status: this.status,
      errorMsg: this.errorMsg,
    };

    return dataClause;
  }
}

module.exports = CreateGdprDeleteRequestManager;
