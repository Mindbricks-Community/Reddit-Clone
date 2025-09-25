const PollOptionManager = require("./PollOptionManager");
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
const { dbGetPolloption } = require("dbLayer");

class GetPollOptionManager extends PollOptionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getPollOption",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: false,
      hasShareToken: false,
    });

    this.dataName = "pollOption";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.pollOptionId = this.pollOptionId;
  }

  readRestParameters(request) {
    this.pollOptionId = request.params?.pollOptionId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.pollOptionId = request.mcpParams.pollOptionId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.pollOptionId == null) {
      throw new BadRequestError("errMsg_pollOptionIdisRequired");
    }

    // ID
    if (
      this.pollOptionId &&
      !isValidObjectId(this.pollOptionId) &&
      !isValidUUID(this.pollOptionId)
    ) {
      throw new BadRequestError("errMsg_pollOptionIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.pollOption?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetPolloption function to get the polloption and return the result to the controller
    const polloption = await dbGetPolloption(this);

    return polloption;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.pollOptionId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = GetPollOptionManager;
