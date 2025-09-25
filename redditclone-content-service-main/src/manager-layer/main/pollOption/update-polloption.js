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
const { dbUpdatePolloption } = require("dbLayer");

class UpdatePollOptionManager extends PollOptionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updatePollOption",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "pollOption";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.pollOptionId = this.pollOptionId;
    jsonObj.optionIndex = this.optionIndex;
    jsonObj.optionText = this.optionText;
  }

  readRestParameters(request) {
    this.pollOptionId = request.params?.pollOptionId;
    this.optionIndex = request.body?.optionIndex;
    this.optionText = request.body?.optionText;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.pollOptionId = request.mcpParams.pollOptionId;
    this.optionIndex = request.mcpParams.optionIndex;
    this.optionText = request.mcpParams.optionText;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getPollOptionById } = require("dbLayer");
    this.pollOption = await getPollOptionById(this.pollOptionId);
    if (!this.pollOption) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.pollOptionId == null) {
      throw new BadRequestError("errMsg_pollOptionIdisRequired");
    }

    if (this.optionText == null) {
      throw new BadRequestError("errMsg_optionTextisRequired");
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
    // make an awaited call to the dbUpdatePolloption function to update the polloption and return the result to the controller
    const polloption = await dbUpdatePolloption(this);

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

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      optionIndex: this.optionIndex,
      optionText: this.optionText,
    };

    return dataClause;
  }
}

module.exports = UpdatePollOptionManager;
