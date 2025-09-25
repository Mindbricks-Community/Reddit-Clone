const AbuseHeuristicTriggerManager = require("./AbuseHeuristicTriggerManager");
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
const { dbGetAbuseheuristictrigger } = require("dbLayer");

class GetAbuseHeuristicTriggerManager extends AbuseHeuristicTriggerManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getAbuseHeuristicTrigger",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseHeuristicTrigger";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.abuseHeuristicTriggerId = this.abuseHeuristicTriggerId;
  }

  readRestParameters(request) {
    this.abuseHeuristicTriggerId = request.params?.abuseHeuristicTriggerId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.abuseHeuristicTriggerId = request.mcpParams.abuseHeuristicTriggerId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.abuseHeuristicTriggerId == null) {
      throw new BadRequestError("errMsg_abuseHeuristicTriggerIdisRequired");
    }

    // ID
    if (
      this.abuseHeuristicTriggerId &&
      !isValidObjectId(this.abuseHeuristicTriggerId) &&
      !isValidUUID(this.abuseHeuristicTriggerId)
    ) {
      throw new BadRequestError("errMsg_abuseHeuristicTriggerIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.abuseHeuristicTrigger?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetAbuseheuristictrigger function to get the abuseheuristictrigger and return the result to the controller
    const abuseheuristictrigger = await dbGetAbuseheuristictrigger(this);

    return abuseheuristictrigger;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.abuseHeuristicTriggerId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = GetAbuseHeuristicTriggerManager;
