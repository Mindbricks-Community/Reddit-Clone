const AbuseReportManager = require("./AbuseReportManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  AbusereportCreatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateAbusereport } = require("dbLayer");

class CreateAbuseReportManager extends AbuseReportManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createAbuseReport",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseReport";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.reportType = this.reportType;
    jsonObj.reportStatus = this.reportStatus;
    jsonObj.reasonText = this.reasonText;
    jsonObj.reporterUserId = this.reporterUserId;
    jsonObj.reportedUserId = this.reportedUserId;
    jsonObj.postId = this.postId;
    jsonObj.commentId = this.commentId;
    jsonObj.origin = this.origin;
    jsonObj.resolutionResult = this.resolutionResult;
    jsonObj.resolvedByUserId = this.resolvedByUserId;
    jsonObj.extraData = this.extraData;
  }

  readRestParameters(request) {
    this.reportType = request.body?.reportType;
    this.reportStatus = request.body?.reportStatus;
    this.reasonText = request.body?.reasonText;
    this.reporterUserId = request.session?.userId;
    this.reportedUserId = request.body?.reportedUserId;
    this.postId = request.body?.postId;
    this.commentId = request.body?.commentId;
    this.origin = request.body?.origin;
    this.resolutionResult = request.body?.resolutionResult;
    this.resolvedByUserId = request.body?.resolvedByUserId;
    this.extraData = request.body?.extraData;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.reportType = request.mcpParams.reportType;
    this.reportStatus = request.mcpParams.reportStatus;
    this.reasonText = request.mcpParams.reasonText;
    this.reporterUserId = request.session.userId;
    this.reportedUserId = request.mcpParams.reportedUserId;
    this.postId = request.mcpParams.postId;
    this.commentId = request.mcpParams.commentId;
    this.origin = request.mcpParams.origin;
    this.resolutionResult = request.mcpParams.resolutionResult;
    this.resolvedByUserId = request.mcpParams.resolvedByUserId;
    this.extraData = request.mcpParams.extraData;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.reportType == null) {
      throw new BadRequestError("errMsg_reportTypeisRequired");
    }

    if (this.reportStatus == null) {
      throw new BadRequestError("errMsg_reportStatusisRequired");
    }

    if (this.reporterUserId == null) {
      throw new BadRequestError("errMsg_reporterUserIdisRequired");
    }

    if (this.origin == null) {
      throw new BadRequestError("errMsg_originisRequired");
    }

    // ID
    if (
      this.reporterUserId &&
      !isValidObjectId(this.reporterUserId) &&
      !isValidUUID(this.reporterUserId)
    ) {
      throw new BadRequestError("errMsg_reporterUserIdisNotAValidID");
    }

    // ID
    if (
      this.reportedUserId &&
      !isValidObjectId(this.reportedUserId) &&
      !isValidUUID(this.reportedUserId)
    ) {
      throw new BadRequestError("errMsg_reportedUserIdisNotAValidID");
    }

    // ID
    if (
      this.postId &&
      !isValidObjectId(this.postId) &&
      !isValidUUID(this.postId)
    ) {
      throw new BadRequestError("errMsg_postIdisNotAValidID");
    }

    // ID
    if (
      this.commentId &&
      !isValidObjectId(this.commentId) &&
      !isValidUUID(this.commentId)
    ) {
      throw new BadRequestError("errMsg_commentIdisNotAValidID");
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

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateAbusereport function to create the abusereport and return the result to the controller
    const abusereport = await dbCreateAbusereport(this);

    return abusereport;
  }

  async raiseEvent() {
    AbusereportCreatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.abuseReportId = this.id;
    if (!this.abuseReportId) this.abuseReportId = newUUID(false);

    const dataClause = {
      id: this.abuseReportId,
      reportType: this.reportType,
      reportStatus: this.reportStatus,
      reasonText: this.reasonText,
      reporterUserId: this.reporterUserId,
      reportedUserId: this.reportedUserId,
      postId: this.postId,
      commentId: this.commentId,
      origin: this.origin,
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

module.exports = CreateAbuseReportManager;
