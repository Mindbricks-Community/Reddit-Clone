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
const { dbUpdateGdprexportrequest } = require("dbLayer");

class UpdateGdprExportRequestManager extends GdprExportRequestManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateGdprExportRequest",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "gdprExportRequest";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.gdprExportRequestId = this.gdprExportRequestId;
    jsonObj.status = this.status;
    jsonObj.exportUrl = this.exportUrl;
    jsonObj.errorMsg = this.errorMsg;
  }

  readRestParameters(request) {
    this.gdprExportRequestId = request.params?.gdprExportRequestId;
    this.status = request.body?.status;
    this.exportUrl = request.body?.exportUrl;
    this.errorMsg = request.body?.errorMsg;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.gdprExportRequestId = request.mcpParams.gdprExportRequestId;
    this.status = request.mcpParams.status;
    this.exportUrl = request.mcpParams.exportUrl;
    this.errorMsg = request.mcpParams.errorMsg;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getGdprExportRequestById } = require("dbLayer");
    this.gdprExportRequest = await getGdprExportRequestById(
      this.gdprExportRequestId,
    );
    if (!this.gdprExportRequest) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.gdprExportRequestId == null) {
      throw new BadRequestError("errMsg_gdprExportRequestIdisRequired");
    }

    // ID
    if (
      this.gdprExportRequestId &&
      !isValidObjectId(this.gdprExportRequestId) &&
      !isValidUUID(this.gdprExportRequestId)
    ) {
      throw new BadRequestError("errMsg_gdprExportRequestIdisNotAValidID");
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
    // make an awaited call to the dbUpdateGdprexportrequest function to update the gdprexportrequest and return the result to the controller
    const gdprexportrequest = await dbUpdateGdprexportrequest(this);

    return gdprexportrequest;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.gdprExportRequestId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      status: this.status,
      exportUrl: this.exportUrl,
      errorMsg: this.errorMsg,
    };

    return dataClause;
  }
}

module.exports = UpdateGdprExportRequestManager;
