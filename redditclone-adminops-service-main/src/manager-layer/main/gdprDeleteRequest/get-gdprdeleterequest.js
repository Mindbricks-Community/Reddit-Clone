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
const { dbGetGdprdeleterequest } = require("dbLayer");

class GetGdprDeleteRequestManager extends GdprDeleteRequestManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getGdprDeleteRequest",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "gdprDeleteRequest";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.gdprDeleteRequestId = this.gdprDeleteRequestId;
  }

  readRestParameters(request) {
    this.gdprDeleteRequestId = request.params?.gdprDeleteRequestId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.gdprDeleteRequestId = request.mcpParams.gdprDeleteRequestId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.gdprDeleteRequestId == null) {
      throw new BadRequestError("errMsg_gdprDeleteRequestIdisRequired");
    }

    // ID
    if (
      this.gdprDeleteRequestId &&
      !isValidObjectId(this.gdprDeleteRequestId) &&
      !isValidUUID(this.gdprDeleteRequestId)
    ) {
      throw new BadRequestError("errMsg_gdprDeleteRequestIdisNotAValidID");
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
    // make an awaited call to the dbGetGdprdeleterequest function to get the gdprdeleterequest and return the result to the controller
    const gdprdeleterequest = await dbGetGdprdeleterequest(this);

    return gdprdeleterequest;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.gdprDeleteRequestId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = GetGdprDeleteRequestManager;
