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
const { dbListCommunityautomodsettings } = require("dbLayer");

class ListCommunityAutomodSettingsManager extends CommunityAutomodSettingManager {
  constructor(request, controllerType) {
    super(request, {
      name: "listCommunityAutomodSettings",
      controllerType: controllerType,
      pagination: true,
      defaultPageRowCount: 25,
      crudType: "getList",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "communityAutomodSettings";
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

    this.isOwner =
      this.communityAutomodSettings?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbListCommunityautomodsettings function to getList the communityautomodsettings and return the result to the controller
    const communityautomodsettings = await dbListCommunityautomodsettings(this);

    return communityautomodsettings;
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

module.exports = ListCommunityAutomodSettingsManager;
