const AutomodEventManager = require("./AutomodEventManager");
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
const { dbDeleteAutomodevent } = require("dbLayer");

class DeleteAutomodEventManager extends AutomodEventManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteAutomodEvent",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "automodEvent";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.automodEventId = this.automodEventId;
  }

  readRestParameters(request) {
    this.automodEventId = request.params?.automodEventId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.automodEventId = request.mcpParams.automodEventId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getAutomodEventById } = require("dbLayer");
    this.automodEvent = await getAutomodEventById(this.automodEventId);
    if (!this.automodEvent) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.automodEventId == null) {
      throw new BadRequestError("errMsg_automodEventIdisRequired");
    }

    // ID
    if (
      this.automodEventId &&
      !isValidObjectId(this.automodEventId) &&
      !isValidUUID(this.automodEventId)
    ) {
      throw new BadRequestError("errMsg_automodEventIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.automodEvent?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbDeleteAutomodevent function to delete the automodevent and return the result to the controller
    const automodevent = await dbDeleteAutomodevent(this);

    return automodevent;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.automodEventId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = DeleteAutomodEventManager;
