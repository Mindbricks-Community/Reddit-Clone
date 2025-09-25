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
const { dbListCommunitypinned } = require("dbLayer");

class ListCommunityPinnedManager extends CommunityPinnedManager {
  constructor(request, controllerType) {
    super(request, {
      name: "listCommunityPinned",
      controllerType: controllerType,
      pagination: true,
      defaultPageRowCount: 25,
      crudType: "getList",
      loginRequired: false,
      hasShareToken: false,
    });

    this.dataName = "communityPinneds";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
  }

  readRestParameters(request) {
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {}

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.communityPinneds?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbListCommunitypinned function to getList the communitypinned and return the result to the controller
    const communitypinned = await dbListCommunitypinned(this);

    return communitypinned;
  }

  async getRouteQuery() {
    return { $and: [{ isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = ListCommunityPinnedManager;
