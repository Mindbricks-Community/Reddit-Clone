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
const { dbCreateMediaobject } = require("dbLayer");

class CreateMediaObjectManager extends MediaObjectManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createMediaObject",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "mediaObject";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.ownerUserId = this.ownerUserId;
    jsonObj.mediaType = this.mediaType;
    jsonObj.originalUrl = this.originalUrl;
    jsonObj.optimizedUrl = this.optimizedUrl;
    jsonObj.previewUrl = this.previewUrl;
    jsonObj.filename = this.filename;
    jsonObj.fileSize = this.fileSize;
    jsonObj.status = this.status;
    jsonObj.nsfwScore = this.nsfwScore;
    jsonObj.malwareStatus = this.malwareStatus;
  }

  readRestParameters(request) {
    this.ownerUserId = request.session?.userId;
    this.mediaType = request.body?.mediaType;
    this.originalUrl = request.body?.originalUrl;
    this.optimizedUrl = request.body?.optimizedUrl;
    this.previewUrl = request.body?.previewUrl;
    this.filename = request.body?.filename;
    this.fileSize = request.body?.fileSize;
    this.status = request.body?.status;
    this.nsfwScore = request.body?.nsfwScore;
    this.malwareStatus = request.body?.malwareStatus;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.ownerUserId = request.session.userId;
    this.mediaType = request.mcpParams.mediaType;
    this.originalUrl = request.mcpParams.originalUrl;
    this.optimizedUrl = request.mcpParams.optimizedUrl;
    this.previewUrl = request.mcpParams.previewUrl;
    this.filename = request.mcpParams.filename;
    this.fileSize = request.mcpParams.fileSize;
    this.status = request.mcpParams.status;
    this.nsfwScore = request.mcpParams.nsfwScore;
    this.malwareStatus = request.mcpParams.malwareStatus;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.ownerUserId == null) {
      throw new BadRequestError("errMsg_ownerUserIdisRequired");
    }

    if (this.mediaType == null) {
      throw new BadRequestError("errMsg_mediaTypeisRequired");
    }

    if (this.originalUrl == null) {
      throw new BadRequestError("errMsg_originalUrlisRequired");
    }

    if (this.status == null) {
      throw new BadRequestError("errMsg_statusisRequired");
    }

    // ID
    if (
      this.ownerUserId &&
      !isValidObjectId(this.ownerUserId) &&
      !isValidUUID(this.ownerUserId)
    ) {
      throw new BadRequestError("errMsg_ownerUserIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.mediaObject?.ownerUserId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateMediaobject function to create the mediaobject and return the result to the controller
    const mediaobject = await dbCreateMediaobject(this);

    return mediaobject;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.mediaObjectId = this.id;
    if (!this.mediaObjectId) this.mediaObjectId = newUUID(false);

    const dataClause = {
      id: this.mediaObjectId,
      ownerUserId: this.ownerUserId,
      mediaType: this.mediaType,
      originalUrl: this.originalUrl,
      optimizedUrl: this.optimizedUrl,
      previewUrl: this.previewUrl,
      filename: this.filename,
      fileSize: this.fileSize,
      status: this.status,
      nsfwScore: this.nsfwScore,
      malwareStatus: this.malwareStatus,
    };

    return dataClause;
  }
}

module.exports = CreateMediaObjectManager;
