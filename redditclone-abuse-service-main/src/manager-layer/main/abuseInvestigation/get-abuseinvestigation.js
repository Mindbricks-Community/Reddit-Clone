const AbuseInvestigationManager = require("./AbuseInvestigationManager");
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
const { dbGetAbuseinvestigation } = require("dbLayer");

class GetAbuseInvestigationManager extends AbuseInvestigationManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getAbuseInvestigation",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseInvestigation";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.abuseInvestigationId = this.abuseInvestigationId;
  }

  readRestParameters(request) {
    this.abuseInvestigationId = request.params?.abuseInvestigationId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.abuseInvestigationId = request.mcpParams.abuseInvestigationId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.abuseInvestigationId == null) {
      throw new BadRequestError("errMsg_abuseInvestigationIdisRequired");
    }

    // ID
    if (
      this.abuseInvestigationId &&
      !isValidObjectId(this.abuseInvestigationId) &&
      !isValidUUID(this.abuseInvestigationId)
    ) {
      throw new BadRequestError("errMsg_abuseInvestigationIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.abuseInvestigation?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetAbuseinvestigation function to get the abuseinvestigation and return the result to the controller
    const abuseinvestigation = await dbGetAbuseinvestigation(this);

    return abuseinvestigation;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.abuseInvestigationId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = GetAbuseInvestigationManager;
