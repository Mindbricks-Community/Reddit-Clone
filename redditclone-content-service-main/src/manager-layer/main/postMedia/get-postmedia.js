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
const { dbGetPostmedia } = require("dbLayer");

class GetPostMediaManager extends PostMediaManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getPostMedia",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: false,
      hasShareToken: false,
    });

    this.dataName = "postMedia";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.postMediaId = this.postMediaId;
  }

  readRestParameters(request) {
    this.postMediaId = request.params?.postMediaId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.postMediaId = request.mcpParams.postMediaId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

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
    // make an awaited call to the dbGetPostmedia function to get the postmedia and return the result to the controller
    const postmedia = await dbGetPostmedia(this);

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
}

module.exports = GetPostMediaManager;
