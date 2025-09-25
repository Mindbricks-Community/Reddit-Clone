const VoteManager = require("./VoteManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { VoteUpdatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateVote } = require("dbLayer");

class UpdateVoteManager extends VoteManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateVote",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "vote";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.voteId = this.voteId;
    jsonObj.voteType = this.voteType;
  }

  readRestParameters(request) {
    this.voteId = request.params?.voteId;
    this.voteType = request.body?.voteType;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.voteId = request.mcpParams.voteId;
    this.voteType = request.mcpParams.voteType;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getVoteById } = require("dbLayer");
    this.vote = await getVoteById(this.voteId);
    if (!this.vote) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

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

  async checkLayer3AuthValidations() {
    // check ownership of the record agianst the session user
    if (!this.isOwner) {
      throw new ForbiddenError("errMsg_voteCanBeAccessedByOwner");
    }

    //check "403" validations
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateVote function to update the vote and return the result to the controller
    const vote = await dbUpdateVote(this);

    return vote;
  }

  async raiseEvent() {
    VoteUpdatedPublisher.Publish(this.output, this.session).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
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

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      voteType: this.voteType,
    };

    return dataClause;
  }
}

module.exports = UpdateVoteManager;
