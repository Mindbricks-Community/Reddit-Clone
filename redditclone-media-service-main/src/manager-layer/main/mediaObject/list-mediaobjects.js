const MediaObjectManager = require("./MediaObjectManager");
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
const { dbListMediaobjects } = require("dbLayer");

class ListMediaObjectsManager extends MediaObjectManager {
  constructor(request, controllerType) {
    super(request, {
      name: "listMediaObjects",
      controllerType: controllerType,
      pagination: true,
      defaultPageRowCount: 20,
      crudType: "getList",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "mediaObjects";
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

    this.isOwner = this.mediaObjects?.ownerUserId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbListMediaobjects function to getList the mediaobjects and return the result to the controller
    const mediaobjects = await dbListMediaobjects(this);

    return mediaobjects;
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

module.exports = ListMediaObjectsManager;
