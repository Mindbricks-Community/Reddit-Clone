const MediaScanManager = require("./MediaScanManager");
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
const { dbCreateMediascan } = require("dbLayer");

class CreateMediaScanManager extends MediaScanManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createMediaScan",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "mediaScan";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.mediaObjectId = this.mediaObjectId;
    jsonObj.scanType = this.scanType;
    jsonObj.result = this.result;
    jsonObj.scanStatus = this.scanStatus;
  }

  readRestParameters(request) {
    this.mediaObjectId = request.body?.mediaObjectId;
    this.scanType = request.body?.scanType;
    this.result = request.body?.result;
    this.scanStatus = request.body?.scanStatus;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.mediaObjectId = request.mcpParams.mediaObjectId;
    this.scanType = request.mcpParams.scanType;
    this.result = request.mcpParams.result;
    this.scanStatus = request.mcpParams.scanStatus;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.mediaObjectId == null) {
      throw new BadRequestError("errMsg_mediaObjectIdisRequired");
    }

    if (this.scanType == null) {
      throw new BadRequestError("errMsg_scanTypeisRequired");
    }

    if (this.result == null) {
      throw new BadRequestError("errMsg_resultisRequired");
    }

    if (this.scanStatus == null) {
      throw new BadRequestError("errMsg_scanStatusisRequired");
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

    this.isOwner = this.mediaScan?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateMediascan function to create the mediascan and return the result to the controller
    const mediascan = await dbCreateMediascan(this);

    return mediascan;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.mediaScanId = this.id;
    if (!this.mediaScanId) this.mediaScanId = newUUID(false);

    const dataClause = {
      id: this.mediaScanId,
      mediaObjectId: this.mediaObjectId,
      scanType: this.scanType,
      result: this.result
        ? typeof this.result == "string"
          ? JSON.parse(this.result)
          : this.result
        : null,
      scanStatus: this.scanStatus,
    };

    return dataClause;
  }
}

module.exports = CreateMediaScanManager;
