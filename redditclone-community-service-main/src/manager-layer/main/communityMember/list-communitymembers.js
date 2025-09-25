const CommunityMemberManager = require("./CommunityMemberManager");
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
const { dbListCommunitymembers } = require("dbLayer");

class ListCommunityMembersManager extends CommunityMemberManager {
  constructor(request, controllerType) {
    super(request, {
      name: "listCommunityMembers",
      controllerType: controllerType,
      pagination: true,
      defaultPageRowCount: 25,
      crudType: "getList",
      loginRequired: false,
      hasShareToken: false,
    });

    this.dataName = "communityMembers";
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

    this.isOwner = this.communityMembers?.userId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbListCommunitymembers function to getList the communitymembers and return the result to the controller
    const communitymembers = await dbListCommunitymembers(this);

    return communitymembers;
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

module.exports = ListCommunityMembersManager;
