const AbuseReportManager = require("./AbuseReportManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  AbusereportUpdatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateAbusereport } = require("dbLayer");

class UpdateAbuseReportManager extends AbuseReportManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateAbuseReport",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseReport";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.abuseReportId = this.abuseReportId;
    jsonObj.reportStatus = this.reportStatus;
    jsonObj.reasonText = this.reasonText;
    jsonObj.resolutionResult = this.resolutionResult;
    jsonObj.resolvedByUserId = this.resolvedByUserId;
    jsonObj.extraData = this.extraData;
  }

  readRestParameters(request) {
    this.abuseReportId = request.params?.abuseReportId;
    this.reportStatus = request.body?.reportStatus;
    this.reasonText = request.body?.reasonText;
    this.resolutionResult = request.body?.resolutionResult;
    this.resolvedByUserId = request.body?.resolvedByUserId;
    this.extraData = request.body?.extraData;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.abuseReportId = request.mcpParams.abuseReportId;
    this.reportStatus = request.mcpParams.reportStatus;
    this.reasonText = request.mcpParams.reasonText;
    this.resolutionResult = request.mcpParams.resolutionResult;
    this.resolvedByUserId = request.mcpParams.resolvedByUserId;
    this.extraData = request.mcpParams.extraData;
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

    // ID
    if (
      this.resolvedByUserId &&
      !isValidObjectId(this.resolvedByUserId) &&
      !isValidUUID(this.resolvedByUserId)
    ) {
      throw new BadRequestError("errMsg_resolvedByUserIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.abuseReport?.reporterUserId === this.session.userId;
  }

  async checkLayer3BusinessValidations() {
    //check if the record is not already deleted
    if (this.abuseReport?.isActive == false) {
      throw new NotFoundError("errMsg_abuseReportObjectAlreadyDeleted");
    }

    //check Layer3 validations
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateAbusereport function to update the abusereport and return the result to the controller
    const abusereport = await dbUpdateAbusereport(this);

    return abusereport;
  }

  async raiseEvent() {
    AbusereportUpdatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getRouteQuery() {
    return { id: this.abuseReportId };

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
      reportStatus: this.reportStatus,
      reasonText: this.reasonText,
      resolutionResult: this.resolutionResult,
      resolvedByUserId: this.resolvedByUserId,
      extraData: this.extraData
        ? typeof this.extraData == "string"
          ? JSON.parse(this.extraData)
          : this.extraData
        : null,
    };

    return dataClause;
  }
}

module.exports = UpdateAbuseReportManager;
