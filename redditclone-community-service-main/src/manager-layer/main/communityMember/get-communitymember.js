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
const { dbGetCommunitymember } = require("dbLayer");

class GetCommunityMemberManager extends CommunityMemberManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getCommunityMember",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "communityMember";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityMemberId = this.communityMemberId;
  }

  readRestParameters(request) {
    this.communityMemberId = request.params?.communityMemberId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.communityMemberId = request.mcpParams.communityMemberId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.communityMemberId == null) {
      throw new BadRequestError("errMsg_communityMemberIdisRequired");
    }

    // ID
    if (
      this.communityMemberId &&
      !isValidObjectId(this.communityMemberId) &&
      !isValidUUID(this.communityMemberId)
    ) {
      throw new BadRequestError("errMsg_communityMemberIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.communityMember?.userId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetCommunitymember function to get the communitymember and return the result to the controller
    const communitymember = await dbGetCommunitymember(this);

    return communitymember;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.communityMemberId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = GetCommunityMemberManager;
