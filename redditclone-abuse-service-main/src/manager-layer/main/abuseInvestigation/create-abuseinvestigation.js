const AbuseInvestigationManager = require("./AbuseInvestigationManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  AbuseinvestigationCreatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateAbuseinvestigation } = require("dbLayer");

class CreateAbuseInvestigationManager extends AbuseInvestigationManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createAbuseInvestigation",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseInvestigation";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.investigationStatus = this.investigationStatus;
    jsonObj.title = this.title;
    jsonObj.openedByUserId = this.openedByUserId;
    jsonObj.assignedToUserIds = this.assignedToUserIds;
    jsonObj.relatedReportIds = this.relatedReportIds;
    jsonObj.relatedFlagIds = this.relatedFlagIds;
    jsonObj.details = this.details;
  }

  readRestParameters(request) {
    this.investigationStatus = request.body?.investigationStatus;
    this.title = request.body?.title;
    this.openedByUserId = request.body?.openedByUserId;
    this.assignedToUserIds = request.body?.assignedToUserIds;
    this.relatedReportIds = request.body?.relatedReportIds;
    this.relatedFlagIds = request.body?.relatedFlagIds;
    this.details = request.body?.details;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.investigationStatus = request.mcpParams.investigationStatus;
    this.title = request.mcpParams.title;
    this.openedByUserId = request.mcpParams.openedByUserId;
    this.assignedToUserIds = request.mcpParams.assignedToUserIds;
    this.relatedReportIds = request.mcpParams.relatedReportIds;
    this.relatedFlagIds = request.mcpParams.relatedFlagIds;
    this.details = request.mcpParams.details;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.investigationStatus == null) {
      throw new BadRequestError("errMsg_investigationStatusisRequired");
    }

    if (this.title == null) {
      throw new BadRequestError("errMsg_titleisRequired");
    }

    if (this.openedByUserId == null) {
      throw new BadRequestError("errMsg_openedByUserIdisRequired");
    }

    // ID
    if (
      this.openedByUserId &&
      !isValidObjectId(this.openedByUserId) &&
      !isValidUUID(this.openedByUserId)
    ) {
      throw new BadRequestError("errMsg_openedByUserIdisNotAValidID");
    }

    // ID
    if (
      this.assignedToUserIds &&
      !isValidObjectId(this.assignedToUserIds) &&
      !isValidUUID(this.assignedToUserIds)
    ) {
      throw new BadRequestError("errMsg_assignedToUserIdsisNotAValidID");
    }

    // ID
    if (
      this.relatedReportIds &&
      !isValidObjectId(this.relatedReportIds) &&
      !isValidUUID(this.relatedReportIds)
    ) {
      throw new BadRequestError("errMsg_relatedReportIdsisNotAValidID");
    }

    // ID
    if (
      this.relatedFlagIds &&
      !isValidObjectId(this.relatedFlagIds) &&
      !isValidUUID(this.relatedFlagIds)
    ) {
      throw new BadRequestError("errMsg_relatedFlagIdsisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.abuseInvestigation?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateAbuseinvestigation function to create the abuseinvestigation and return the result to the controller
    const abuseinvestigation = await dbCreateAbuseinvestigation(this);

    return abuseinvestigation;
  }

  async raiseEvent() {
    AbuseinvestigationCreatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.abuseInvestigationId = this.id;
    if (!this.abuseInvestigationId) this.abuseInvestigationId = newUUID(false);

    const dataClause = {
      id: this.abuseInvestigationId,
      investigationStatus: this.investigationStatus,
      title: this.title,
      openedByUserId: this.openedByUserId,
      assignedToUserIds: this.assignedToUserIds,
      relatedReportIds: this.relatedReportIds,
      relatedFlagIds: this.relatedFlagIds,
      details: this.details
        ? typeof this.details == "string"
          ? JSON.parse(this.details)
          : this.details
        : null,
    };

    return dataClause;
  }
}

module.exports = CreateAbuseInvestigationManager;
