const CommunityRuleManager = require("./CommunityRuleManager");
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
const { dbGetCommunityrule } = require("dbLayer");

class GetCommunityRuleManager extends CommunityRuleManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getCommunityRule",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: false,
      hasShareToken: false,
    });

    this.dataName = "communityRule";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityRuleId = this.communityRuleId;
  }

  readRestParameters(request) {
    this.communityRuleId = request.params?.communityRuleId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.communityRuleId = request.mcpParams.communityRuleId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.communityRuleId == null) {
      throw new BadRequestError("errMsg_communityRuleIdisRequired");
    }

    // ID
    if (
      this.communityRuleId &&
      !isValidObjectId(this.communityRuleId) &&
      !isValidUUID(this.communityRuleId)
    ) {
      throw new BadRequestError("errMsg_communityRuleIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.communityRule?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetCommunityrule function to get the communityrule and return the result to the controller
    const communityrule = await dbGetCommunityrule(this);

    return communityrule;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.communityRuleId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = GetCommunityRuleManager;
