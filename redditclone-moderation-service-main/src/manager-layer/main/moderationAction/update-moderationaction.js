const ModerationActionManager = require("./ModerationActionManager");
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
const { dbUpdateModerationaction } = require("dbLayer");

class UpdateModerationActionManager extends ModerationActionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateModerationAction",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "moderationAction";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.moderationActionId = this.moderationActionId;
    jsonObj.reason = this.reason;
    jsonObj.notes = this.notes;
  }

  readRestParameters(request) {
    this.moderationActionId = request.params?.moderationActionId;
    this.reason = request.body?.reason;
    this.notes = request.body?.notes;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.moderationActionId = request.mcpParams.moderationActionId;
    this.reason = request.mcpParams.reason;
    this.notes = request.mcpParams.notes;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getModerationActionById } = require("dbLayer");
    this.moderationAction = await getModerationActionById(
      this.moderationActionId,
    );
    if (!this.moderationAction) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.moderationActionId == null) {
      throw new BadRequestError("errMsg_moderationActionIdisRequired");
    }

    // ID
    if (
      this.moderationActionId &&
      !isValidObjectId(this.moderationActionId) &&
      !isValidUUID(this.moderationActionId)
    ) {
      throw new BadRequestError("errMsg_moderationActionIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.moderationAction?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateModerationaction function to update the moderationaction and return the result to the controller
    const moderationaction = await dbUpdateModerationaction(this);

    return moderationaction;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.moderationActionId }, { isActive: true }] };

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
      reason: this.reason,
      notes: this.notes,
    };

    return dataClause;
  }
}

module.exports = UpdateModerationActionManager;
