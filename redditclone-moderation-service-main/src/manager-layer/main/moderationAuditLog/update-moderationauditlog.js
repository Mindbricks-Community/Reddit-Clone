const ModerationAuditLogManager = require("./ModerationAuditLogManager");
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
const { dbUpdateModerationauditlog } = require("dbLayer");

class UpdateModerationAuditLogManager extends ModerationAuditLogManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateModerationAuditLog",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "moderationAuditLog";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.moderationAuditLogId = this.moderationAuditLogId;
  }

  readRestParameters(request) {
    this.moderationAuditLogId = request.params?.moderationAuditLogId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.moderationAuditLogId = request.mcpParams.moderationAuditLogId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getModerationAuditLogById } = require("dbLayer");
    this.moderationAuditLog = await getModerationAuditLogById(
      this.moderationAuditLogId,
    );
    if (!this.moderationAuditLog) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.moderationAuditLogId == null) {
      throw new BadRequestError("errMsg_moderationAuditLogIdisRequired");
    }

    // ID
    if (
      this.moderationAuditLogId &&
      !isValidObjectId(this.moderationAuditLogId) &&
      !isValidUUID(this.moderationAuditLogId)
    ) {
      throw new BadRequestError("errMsg_moderationAuditLogIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.moderationAuditLog?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateModerationauditlog function to update the moderationauditlog and return the result to the controller
    const moderationauditlog = await dbUpdateModerationauditlog(this);

    return moderationauditlog;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.moderationAuditLogId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {};

    return dataClause;
  }
}

module.exports = UpdateModerationAuditLogManager;
