const GdprExportRequestManager = require("./GdprExportRequestManager");
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
const { dbCreateGdprexportrequest } = require("dbLayer");

class CreateGdprExportRequestManager extends GdprExportRequestManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createGdprExportRequest",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "gdprExportRequest";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.userId = this.userId;
    jsonObj.requestedByAdminId = this.requestedByAdminId;
    jsonObj.status = this.status;
    jsonObj.exportUrl = this.exportUrl;
    jsonObj.errorMsg = this.errorMsg;
  }

  readRestParameters(request) {
    this.userId = request.body?.userId;
    this.requestedByAdminId = request.body?.requestedByAdminId;
    this.status = request.body?.status;
    this.exportUrl = request.body?.exportUrl;
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
    this.exportUrl = request.mcpParams.exportUrl;
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

    this.isOwner = this.gdprExportRequest?._owner === this.session.userId;
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
    // make an awaited call to the dbCreateGdprexportrequest function to create the gdprexportrequest and return the result to the controller
    const gdprexportrequest = await dbCreateGdprexportrequest(this);

    return gdprexportrequest;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.gdprExportRequestId = this.id;
    if (!this.gdprExportRequestId) this.gdprExportRequestId = newUUID(false);

    const dataClause = {
      id: this.gdprExportRequestId,
      userId: this.userId,
      requestedByAdminId: this.requestedByAdminId,
      status: this.status,
      exportUrl: this.exportUrl,
      errorMsg: this.errorMsg,
    };

    return dataClause;
  }
}

module.exports = CreateGdprExportRequestManager;
