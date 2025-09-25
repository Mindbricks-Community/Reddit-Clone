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
const { dbUpdateMediascan } = require("dbLayer");

class UpdateMediaScanManager extends MediaScanManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateMediaScan",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "mediaScan";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.mediaScanId = this.mediaScanId;
  }

  readRestParameters(request) {
    this.mediaScanId = request.params?.mediaScanId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.mediaScanId = request.mcpParams.mediaScanId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getMediaScanById } = require("dbLayer");
    this.mediaScan = await getMediaScanById(this.mediaScanId);
    if (!this.mediaScan) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.mediaScanId == null) {
      throw new BadRequestError("errMsg_mediaScanIdisRequired");
    }

    // ID
    if (
      this.mediaScanId &&
      !isValidObjectId(this.mediaScanId) &&
      !isValidUUID(this.mediaScanId)
    ) {
      throw new BadRequestError("errMsg_mediaScanIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.mediaScan?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateMediascan function to update the mediascan and return the result to the controller
    const mediascan = await dbUpdateMediascan(this);

    return mediascan;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.mediaScanId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {};

    return dataClause;
  }
}

module.exports = UpdateMediaScanManager;
