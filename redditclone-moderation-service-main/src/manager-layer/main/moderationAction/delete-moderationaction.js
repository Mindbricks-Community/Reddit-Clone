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
const { dbDeleteModerationaction } = require("dbLayer");

class DeleteModerationActionManager extends ModerationActionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteModerationAction",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "moderationAction";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.moderationActionId = this.moderationActionId;
  }

  readRestParameters(request) {
    this.moderationActionId = request.params?.moderationActionId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.moderationActionId = request.mcpParams.moderationActionId;
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
    // make an awaited call to the dbDeleteModerationaction function to delete the moderationaction and return the result to the controller
    const moderationaction = await dbDeleteModerationaction(this);

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
}

module.exports = DeleteModerationActionManager;
