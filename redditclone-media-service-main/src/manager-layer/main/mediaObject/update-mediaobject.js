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
const { dbUpdateMediaobject } = require("dbLayer");

class UpdateMediaObjectManager extends MediaObjectManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateMediaObject",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "mediaObject";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.mediaObjectId = this.mediaObjectId;
    jsonObj.optimizedUrl = this.optimizedUrl;
    jsonObj.previewUrl = this.previewUrl;
    jsonObj.status = this.status;
    jsonObj.nsfwScore = this.nsfwScore;
    jsonObj.malwareStatus = this.malwareStatus;
  }

  readRestParameters(request) {
    this.mediaObjectId = request.params?.mediaObjectId;
    this.optimizedUrl = request.body?.optimizedUrl;
    this.previewUrl = request.body?.previewUrl;
    this.status = request.body?.status;
    this.nsfwScore = request.body?.nsfwScore;
    this.malwareStatus = request.body?.malwareStatus;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.mediaObjectId = request.mcpParams.mediaObjectId;
    this.optimizedUrl = request.mcpParams.optimizedUrl;
    this.previewUrl = request.mcpParams.previewUrl;
    this.status = request.mcpParams.status;
    this.nsfwScore = request.mcpParams.nsfwScore;
    this.malwareStatus = request.mcpParams.malwareStatus;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getMediaObjectById } = require("dbLayer");
    this.mediaObject = await getMediaObjectById(this.mediaObjectId);
    if (!this.mediaObject) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

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
    // make an awaited call to the dbUpdateMediaobject function to update the mediaobject and return the result to the controller
    const mediaobject = await dbUpdateMediaobject(this);

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

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      optimizedUrl: this.optimizedUrl,
      previewUrl: this.previewUrl,
      status: this.status,
      nsfwScore: this.nsfwScore,
      malwareStatus: this.malwareStatus,
    };

    return dataClause;
  }
}

module.exports = UpdateMediaObjectManager;
