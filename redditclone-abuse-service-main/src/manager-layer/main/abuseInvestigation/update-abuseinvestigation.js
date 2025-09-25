const AbuseInvestigationManager = require("./AbuseInvestigationManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  AbuseinvestigationUpdatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateAbuseinvestigation } = require("dbLayer");

class UpdateAbuseInvestigationManager extends AbuseInvestigationManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateAbuseInvestigation",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseInvestigation";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.abuseInvestigationId = this.abuseInvestigationId;
    jsonObj.investigationStatus = this.investigationStatus;
    jsonObj.title = this.title;
    jsonObj.assignedToUserIds = this.assignedToUserIds;
    jsonObj.relatedReportIds = this.relatedReportIds;
    jsonObj.relatedFlagIds = this.relatedFlagIds;
    jsonObj.details = this.details;
  }

  readRestParameters(request) {
    this.abuseInvestigationId = request.params?.abuseInvestigationId;
    this.investigationStatus = request.body?.investigationStatus;
    this.title = request.body?.title;
    this.assignedToUserIds = request.body?.assignedToUserIds;
    this.relatedReportIds = request.body?.relatedReportIds;
    this.relatedFlagIds = request.body?.relatedFlagIds;
    this.details = request.body?.details;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.abuseInvestigationId = request.mcpParams.abuseInvestigationId;
    this.investigationStatus = request.mcpParams.investigationStatus;
    this.title = request.mcpParams.title;
    this.assignedToUserIds = request.mcpParams.assignedToUserIds;
    this.relatedReportIds = request.mcpParams.relatedReportIds;
    this.relatedFlagIds = request.mcpParams.relatedFlagIds;
    this.details = request.mcpParams.details;
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

  async checkLayer3BusinessValidations() {
    //check if the record is not already deleted
    if (this.abuseInvestigation?.isActive == false) {
      throw new NotFoundError("errMsg_abuseInvestigationObjectAlreadyDeleted");
    }

    //check Layer3 validations
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateAbuseinvestigation function to update the abuseinvestigation and return the result to the controller
    const abuseinvestigation = await dbUpdateAbuseinvestigation(this);

    return abuseinvestigation;
  }

  async raiseEvent() {
    AbuseinvestigationUpdatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getRouteQuery() {
    return { id: this.abuseInvestigationId };

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
      investigationStatus: this.investigationStatus,
      title: this.title,
      assignedToUserIds: this.assignedToUserIds
        ? this.assignedToUserIds
        : this.assignedToUserIds_remove
          ? sequelize.fn(
              "array_remove",
              sequelize.col("assignedToUserIds"),
              this.assignedToUserIds_remove,
            )
          : this.assignedToUserIds_append
            ? sequelize.fn(
                "array_append",
                sequelize.col("assignedToUserIds"),
                this.assignedToUserIds_append,
              )
            : undefined,
      relatedReportIds: this.relatedReportIds
        ? this.relatedReportIds
        : this.relatedReportIds_remove
          ? sequelize.fn(
              "array_remove",
              sequelize.col("relatedReportIds"),
              this.relatedReportIds_remove,
            )
          : this.relatedReportIds_append
            ? sequelize.fn(
                "array_append",
                sequelize.col("relatedReportIds"),
                this.relatedReportIds_append,
              )
            : undefined,
      relatedFlagIds: this.relatedFlagIds
        ? this.relatedFlagIds
        : this.relatedFlagIds_remove
          ? sequelize.fn(
              "array_remove",
              sequelize.col("relatedFlagIds"),
              this.relatedFlagIds_remove,
            )
          : this.relatedFlagIds_append
            ? sequelize.fn(
                "array_append",
                sequelize.col("relatedFlagIds"),
                this.relatedFlagIds_append,
              )
            : undefined,
      details: this.details
        ? typeof this.details == "string"
          ? JSON.parse(this.details)
          : this.details
        : null,
    };

    return dataClause;
  }
}

module.exports = UpdateAbuseInvestigationManager;
