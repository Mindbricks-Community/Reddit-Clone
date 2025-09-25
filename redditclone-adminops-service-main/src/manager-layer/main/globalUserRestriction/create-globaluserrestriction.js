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
const { dbCreateGlobaluserrestriction } = require("dbLayer");

class CreateGlobalUserRestrictionManager extends GlobalUserRestrictionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createGlobalUserRestriction",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "globalUserRestriction";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.userId = this.userId;
    jsonObj.restrictionType = this.restrictionType;
    jsonObj.status = this.status;
    jsonObj.startDate = this.startDate;
    jsonObj.endDate = this.endDate;
    jsonObj.reason = this.reason;
    jsonObj.adminId = this.adminId;
  }

  readRestParameters(request) {
    this.userId = request.body?.userId;
    this.restrictionType = request.body?.restrictionType;
    this.status = request.body?.status;
    this.startDate = request.body?.startDate;
    this.endDate = request.body?.endDate;
    this.reason = request.body?.reason;
    this.adminId = request.body?.adminId;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.userId = request.mcpParams.userId;
    this.restrictionType = request.mcpParams.restrictionType;
    this.status = request.mcpParams.status;
    this.startDate = request.mcpParams.startDate;
    this.endDate = request.mcpParams.endDate;
    this.reason = request.mcpParams.reason;
    this.adminId = request.mcpParams.adminId;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.userId == null) {
      throw new BadRequestError("errMsg_userIdisRequired");
    }

    if (this.restrictionType == null) {
      throw new BadRequestError("errMsg_restrictionTypeisRequired");
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
    // make an awaited call to the dbCreateGlobaluserrestriction function to create the globaluserrestriction and return the result to the controller
    const globaluserrestriction = await dbCreateGlobaluserrestriction(this);

    return globaluserrestriction;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.globalUserRestrictionId = this.id;
    if (!this.globalUserRestrictionId)
      this.globalUserRestrictionId = newUUID(false);

    const dataClause = {
      id: this.globalUserRestrictionId,
      userId: this.userId,
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

module.exports = CreateGlobalUserRestrictionManager;
