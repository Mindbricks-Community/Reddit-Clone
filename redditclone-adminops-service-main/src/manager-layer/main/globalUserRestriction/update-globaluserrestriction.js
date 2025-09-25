const GlobalUserRestrictionManager = require("./GlobalUserRestrictionManager");
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
const { dbUpdateGlobaluserrestriction } = require("dbLayer");

class UpdateGlobalUserRestrictionManager extends GlobalUserRestrictionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateGlobalUserRestriction",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "globalUserRestriction";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.globalUserRestrictionId = this.globalUserRestrictionId;
    jsonObj.restrictionType = this.restrictionType;
    jsonObj.status = this.status;
    jsonObj.startDate = this.startDate;
    jsonObj.endDate = this.endDate;
    jsonObj.reason = this.reason;
    jsonObj.adminId = this.adminId;
  }

  readRestParameters(request) {
    this.globalUserRestrictionId = request.params?.globalUserRestrictionId;
    this.restrictionType = request.body?.restrictionType;
    this.status = request.body?.status;
    this.startDate = request.body?.startDate;
    this.endDate = request.body?.endDate;
    this.reason = request.body?.reason;
    this.adminId = request.body?.adminId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.globalUserRestrictionId = request.mcpParams.globalUserRestrictionId;
    this.restrictionType = request.mcpParams.restrictionType;
    this.status = request.mcpParams.status;
    this.startDate = request.mcpParams.startDate;
    this.endDate = request.mcpParams.endDate;
    this.reason = request.mcpParams.reason;
    this.adminId = request.mcpParams.adminId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getGlobalUserRestrictionById } = require("dbLayer");
    this.globalUserRestriction = await getGlobalUserRestrictionById(
      this.globalUserRestrictionId,
    );
    if (!this.globalUserRestriction) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.globalUserRestrictionId == null) {
      throw new BadRequestError("errMsg_globalUserRestrictionIdisRequired");
    }

    // ID
    if (
      this.globalUserRestrictionId &&
      !isValidObjectId(this.globalUserRestrictionId) &&
      !isValidUUID(this.globalUserRestrictionId)
    ) {
      throw new BadRequestError("errMsg_globalUserRestrictionIdisNotAValidID");
    }

    // ID
    if (
      this.adminId &&
      !isValidObjectId(this.adminId) &&
      !isValidUUID(this.adminId)
    ) {
      throw new BadRequestError("errMsg_adminIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.globalUserRestriction?._owner === this.session.userId;
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
    // make an awaited call to the dbUpdateGlobaluserrestriction function to update the globaluserrestriction and return the result to the controller
    const globaluserrestriction = await dbUpdateGlobaluserrestriction(this);

    return globaluserrestriction;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.globalUserRestrictionId }, { isActive: true }] };

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
      restrictionType: this.restrictionType,
      status: this.status,
      startDate: this.startDate,
      endDate: this.endDate,
      reason: this.reason,
      adminId: this.adminId,
    };

    return dataClause;
  }
}

module.exports = UpdateGlobalUserRestrictionManager;
