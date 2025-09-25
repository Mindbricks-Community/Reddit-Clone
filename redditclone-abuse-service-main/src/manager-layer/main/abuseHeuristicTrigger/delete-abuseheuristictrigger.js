const AbuseHeuristicTriggerManager = require("./AbuseHeuristicTriggerManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  AbuseheuristictriggerDeletedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbDeleteAbuseheuristictrigger } = require("dbLayer");

class DeleteAbuseHeuristicTriggerManager extends AbuseHeuristicTriggerManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteAbuseHeuristicTrigger",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseHeuristicTrigger";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.abuseHeuristicTriggerId = this.abuseHeuristicTriggerId;
  }

  readRestParameters(request) {
    this.abuseHeuristicTriggerId = request.params?.abuseHeuristicTriggerId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.abuseHeuristicTriggerId = request.mcpParams.abuseHeuristicTriggerId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getAbuseHeuristicTriggerById } = require("dbLayer");
    this.abuseHeuristicTrigger = await getAbuseHeuristicTriggerById(
      this.abuseHeuristicTriggerId,
    );
    if (!this.abuseHeuristicTrigger) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.abuseHeuristicTriggerId == null) {
      throw new BadRequestError("errMsg_abuseHeuristicTriggerIdisRequired");
    }

    // ID
    if (
      this.abuseHeuristicTriggerId &&
      !isValidObjectId(this.abuseHeuristicTriggerId) &&
      !isValidUUID(this.abuseHeuristicTriggerId)
    ) {
      throw new BadRequestError("errMsg_abuseHeuristicTriggerIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.abuseHeuristicTrigger?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbDeleteAbuseheuristictrigger function to delete the abuseheuristictrigger and return the result to the controller
    const abuseheuristictrigger = await dbDeleteAbuseheuristictrigger(this);

    return abuseheuristictrigger;
  }

  async raiseEvent() {
    AbuseheuristictriggerDeletedPublisher.Publish(
      this.output,
      this.session,
    ).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getRouteQuery() {
    return { $and: [{ id: this.abuseHeuristicTriggerId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = DeleteAbuseHeuristicTriggerManager;
