const AbuseHeuristicTriggerManager = require("./AbuseHeuristicTriggerManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  AbuseheuristictriggerUpdatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateAbuseheuristictrigger } = require("dbLayer");

class UpdateAbuseHeuristicTriggerManager extends AbuseHeuristicTriggerManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateAbuseHeuristicTrigger",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseHeuristicTrigger";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.abuseHeuristicTriggerId = this.abuseHeuristicTriggerId;
    jsonObj.details = this.details;
  }

  readRestParameters(request) {
    this.abuseHeuristicTriggerId = request.params?.abuseHeuristicTriggerId;
    this.details = request.body?.details;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.abuseHeuristicTriggerId = request.mcpParams.abuseHeuristicTriggerId;
    this.details = request.mcpParams.details;
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

  async checkLayer3BusinessValidations() {
    //check if the record is not already deleted
    if (this.abuseHeuristicTrigger?.isActive == false) {
      throw new NotFoundError(
        "errMsg_abuseHeuristicTriggerObjectAlreadyDeleted",
      );
    }

    //check Layer3 validations
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateAbuseheuristictrigger function to update the abuseheuristictrigger and return the result to the controller
    const abuseheuristictrigger = await dbUpdateAbuseheuristictrigger(this);

    return abuseheuristictrigger;
  }

  async raiseEvent() {
    AbuseheuristictriggerUpdatedPublisher.Publish(
      this.output,
      this.session,
    ).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getRouteQuery() {
    return { id: this.abuseHeuristicTriggerId };

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
      details: this.details
        ? typeof this.details == "string"
          ? JSON.parse(this.details)
          : this.details
        : null,
    };

    return dataClause;
  }
}

module.exports = UpdateAbuseHeuristicTriggerManager;
