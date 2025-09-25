const CommunityPinnedManager = require("./CommunityPinnedManager");
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
const { dbGetCommunitypinned } = require("dbLayer");

class GetCommunityPinnedManager extends CommunityPinnedManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getCommunityPinned",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: false,
      hasShareToken: false,
    });

    this.dataName = "communityPinned";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityPinnedId = this.communityPinnedId;
  }

  readRestParameters(request) {
    this.communityPinnedId = request.params?.communityPinnedId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.communityPinnedId = request.mcpParams.communityPinnedId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.communityPinnedId == null) {
      throw new BadRequestError("errMsg_communityPinnedIdisRequired");
    }

    // ID
    if (
      this.communityPinnedId &&
      !isValidObjectId(this.communityPinnedId) &&
      !isValidUUID(this.communityPinnedId)
    ) {
      throw new BadRequestError("errMsg_communityPinnedIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.communityPinned?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetCommunitypinned function to get the communitypinned and return the result to the controller
    const communitypinned = await dbGetCommunitypinned(this);

    return communitypinned;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.communityPinnedId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = GetCommunityPinnedManager;
