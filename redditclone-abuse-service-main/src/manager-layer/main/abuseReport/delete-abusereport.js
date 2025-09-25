const AbuseReportManager = require("./AbuseReportManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  AbusereportDeletedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbDeleteAbusereport } = require("dbLayer");

class DeleteAbuseReportManager extends AbuseReportManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteAbuseReport",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseReport";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.abuseReportId = this.abuseReportId;
  }

  readRestParameters(request) {
    this.abuseReportId = request.params?.abuseReportId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.abuseReportId = request.mcpParams.abuseReportId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getAbuseReportById } = require("dbLayer");
    this.abuseReport = await getAbuseReportById(this.abuseReportId);
    if (!this.abuseReport) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.abuseReportId == null) {
      throw new BadRequestError("errMsg_abuseReportIdisRequired");
    }

    // ID
    if (
      this.abuseReportId &&
      !isValidObjectId(this.abuseReportId) &&
      !isValidUUID(this.abuseReportId)
    ) {
      throw new BadRequestError("errMsg_abuseReportIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.abuseReport?.reporterUserId === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbDeleteAbusereport function to delete the abusereport and return the result to the controller
    const abusereport = await dbDeleteAbusereport(this);

    return abusereport;
  }

  async raiseEvent() {
    AbusereportDeletedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getRouteQuery() {
    return { $and: [{ id: this.abuseReportId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = DeleteAbuseReportManager;
