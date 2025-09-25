const AbuseInvestigationManager = require("./AbuseInvestigationManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  AbuseinvestigationDeletedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbDeleteAbuseinvestigation } = require("dbLayer");

class DeleteAbuseInvestigationManager extends AbuseInvestigationManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteAbuseInvestigation",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseInvestigation";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.abuseInvestigationId = this.abuseInvestigationId;
  }

  readRestParameters(request) {
    this.abuseInvestigationId = request.params?.abuseInvestigationId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.abuseInvestigationId = request.mcpParams.abuseInvestigationId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getAbuseInvestigationById } = require("dbLayer");
    this.abuseInvestigation = await getAbuseInvestigationById(
      this.abuseInvestigationId,
    );
    if (!this.abuseInvestigation) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.abuseInvestigationId == null) {
      throw new BadRequestError("errMsg_abuseInvestigationIdisRequired");
    }

    // ID
    if (
      this.abuseInvestigationId &&
      !isValidObjectId(this.abuseInvestigationId) &&
      !isValidUUID(this.abuseInvestigationId)
    ) {
      throw new BadRequestError("errMsg_abuseInvestigationIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.abuseInvestigation?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbDeleteAbuseinvestigation function to delete the abuseinvestigation and return the result to the controller
    const abuseinvestigation = await dbDeleteAbuseinvestigation(this);

    return abuseinvestigation;
  }

  async raiseEvent() {
    AbuseinvestigationDeletedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getRouteQuery() {
    return { $and: [{ id: this.abuseInvestigationId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = DeleteAbuseInvestigationManager;
