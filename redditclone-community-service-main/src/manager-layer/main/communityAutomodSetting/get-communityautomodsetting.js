const CommunityAutomodSettingManager = require("./CommunityAutomodSettingManager");
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
const { dbGetCommunityautomodsetting } = require("dbLayer");

class GetCommunityAutomodSettingManager extends CommunityAutomodSettingManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getCommunityAutomodSetting",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "communityAutomodSetting";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityAutomodSettingId = this.communityAutomodSettingId;
  }

  readRestParameters(request) {
    this.communityAutomodSettingId = request.params?.communityAutomodSettingId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.communityAutomodSettingId =
      request.mcpParams.communityAutomodSettingId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.communityAutomodSettingId == null) {
      throw new BadRequestError("errMsg_communityAutomodSettingIdisRequired");
    }

    // ID
    if (
      this.communityAutomodSettingId &&
      !isValidObjectId(this.communityAutomodSettingId) &&
      !isValidUUID(this.communityAutomodSettingId)
    ) {
      throw new BadRequestError(
        "errMsg_communityAutomodSettingIdisNotAValidID",
      );
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.communityAutomodSetting?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetCommunityautomodsetting function to get the communityautomodsetting and return the result to the controller
    const communityautomodsetting = await dbGetCommunityautomodsetting(this);

    return communityautomodsetting;
  }

  async getRouteQuery() {
    return {
      $and: [{ id: this.communityAutomodSettingId }, { isActive: true }],
    };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = GetCommunityAutomodSettingManager;
