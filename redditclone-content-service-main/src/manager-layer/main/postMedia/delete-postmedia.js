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
const { dbDeletePostmedia } = require("dbLayer");

class DeletePostMediaManager extends PostMediaManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deletePostMedia",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
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
    // make an awaited call to the dbDeletePostmedia function to delete the postmedia and return the result to the controller
    const postmedia = await dbDeletePostmedia(this);

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

module.exports = DeletePostMediaManager;
