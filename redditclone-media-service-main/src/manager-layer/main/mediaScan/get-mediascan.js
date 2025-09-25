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
const { dbGetMediascan } = require("dbLayer");

class GetMediaScanManager extends MediaScanManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getMediaScan",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
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
    // make an awaited call to the dbGetMediascan function to get the mediascan and return the result to the controller
    const mediascan = await dbGetMediascan(this);

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
}

module.exports = GetMediaScanManager;
