const AbuseFlagManager = require("./AbuseFlagManager");
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
const { dbGetAbuseflag } = require("dbLayer");

class GetAbuseFlagManager extends AbuseFlagManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getAbuseFlag",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseFlag";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.abuseFlagId = this.abuseFlagId;
  }

  readRestParameters(request) {
    this.abuseFlagId = request.params?.abuseFlagId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.abuseFlagId = request.mcpParams.abuseFlagId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.abuseFlagId == null) {
      throw new BadRequestError("errMsg_abuseFlagIdisRequired");
    }

    // ID
    if (
      this.abuseFlagId &&
      !isValidObjectId(this.abuseFlagId) &&
      !isValidUUID(this.abuseFlagId)
    ) {
      throw new BadRequestError("errMsg_abuseFlagIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.abuseFlag?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetAbuseflag function to get the abuseflag and return the result to the controller
    const abuseflag = await dbGetAbuseflag(this);

    return abuseflag;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.abuseFlagId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = GetAbuseFlagManager;
