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
const { dbDeletePolloption } = require("dbLayer");

class DeletePollOptionManager extends PollOptionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deletePollOption",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
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
    // make an awaited call to the dbDeletePolloption function to delete the polloption and return the result to the controller
    const polloption = await dbDeletePolloption(this);

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

module.exports = DeletePollOptionManager;
