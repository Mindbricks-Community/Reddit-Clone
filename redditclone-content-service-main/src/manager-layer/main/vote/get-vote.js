const VoteManager = require("./VoteManager");
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
const { dbGetVote } = require("dbLayer");

class GetVoteManager extends VoteManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getVote",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: false,
      hasShareToken: false,
    });

    this.dataName = "vote";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.voteId = this.voteId;
  }

  readRestParameters(request) {
    this.voteId = request.params?.voteId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.voteId = request.mcpParams.voteId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.voteId == null) {
      throw new BadRequestError("errMsg_voteIdisRequired");
    }

    // ID
    if (
      this.voteId &&
      !isValidObjectId(this.voteId) &&
      !isValidUUID(this.voteId)
    ) {
      throw new BadRequestError("errMsg_voteIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.vote?.userId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetVote function to get the vote and return the result to the controller
    const vote = await dbGetVote(this);

    return vote;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.voteId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = GetVoteManager;
