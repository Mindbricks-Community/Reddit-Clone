const PostMediaManager = require("./PostMediaManager");
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
const { dbUpdatePostmedia } = require("dbLayer");

class UpdatePostMediaManager extends PostMediaManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updatePostMedia",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "postMedia";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.postMediaId = this.postMediaId;
    jsonObj.mediaIndex = this.mediaIndex;
    jsonObj.caption = this.caption;
  }

  readRestParameters(request) {
    this.postMediaId = request.params?.postMediaId;
    this.mediaIndex = request.body?.mediaIndex;
    this.caption = request.body?.caption;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.postMediaId = request.mcpParams.postMediaId;
    this.mediaIndex = request.mcpParams.mediaIndex;
    this.caption = request.mcpParams.caption;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getPostMediaById } = require("dbLayer");
    this.postMedia = await getPostMediaById(this.postMediaId);
    if (!this.postMedia) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.postMediaId == null) {
      throw new BadRequestError("errMsg_postMediaIdisRequired");
    }

    // ID
    if (
      this.postMediaId &&
      !isValidObjectId(this.postMediaId) &&
      !isValidUUID(this.postMediaId)
    ) {
      throw new BadRequestError("errMsg_postMediaIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.postMedia?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdatePostmedia function to update the postmedia and return the result to the controller
    const postmedia = await dbUpdatePostmedia(this);

    return postmedia;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.postMediaId }, { isActive: true }] };

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
      mediaIndex: this.mediaIndex,
      caption: this.caption,
    };

    return dataClause;
  }
}

module.exports = UpdatePostMediaManager;
