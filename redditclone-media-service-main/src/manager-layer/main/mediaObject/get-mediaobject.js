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
const { dbGetMediaobject } = require("dbLayer");

class GetMediaObjectManager extends MediaObjectManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getMediaObject",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "mediaObject";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.mediaObjectId = this.mediaObjectId;
  }

  readRestParameters(request) {
    this.mediaObjectId = request.params?.mediaObjectId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.mediaObjectId = request.mcpParams.mediaObjectId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.mediaObjectId == null) {
      throw new BadRequestError("errMsg_mediaObjectIdisRequired");
    }

    // ID
    if (
      this.mediaObjectId &&
      !isValidObjectId(this.mediaObjectId) &&
      !isValidUUID(this.mediaObjectId)
    ) {
      throw new BadRequestError("errMsg_mediaObjectIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.mediaObject?.ownerUserId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetMediaobject function to get the mediaobject and return the result to the controller
    const mediaobject = await dbGetMediaobject(this);

    return mediaobject;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.mediaObjectId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = GetMediaObjectManager;
