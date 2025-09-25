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
const { dbDeleteGlobaluserrestriction } = require("dbLayer");

class DeleteGlobalUserRestrictionManager extends GlobalUserRestrictionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteGlobalUserRestriction",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "globalUserRestriction";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.globalUserRestrictionId = this.globalUserRestrictionId;
  }

  readRestParameters(request) {
    this.globalUserRestrictionId = request.params?.globalUserRestrictionId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.globalUserRestrictionId = request.mcpParams.globalUserRestrictionId;
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
    // make an awaited call to the dbDeleteGlobaluserrestriction function to delete the globaluserrestriction and return the result to the controller
    const globaluserrestriction = await dbDeleteGlobaluserrestriction(this);

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
}

module.exports = DeleteGlobalUserRestrictionManager;
