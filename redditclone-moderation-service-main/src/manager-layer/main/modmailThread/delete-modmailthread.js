const ModmailThreadManager = require("./ModmailThreadManager");
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
const { dbDeleteModmailthread } = require("dbLayer");

class DeleteModmailThreadManager extends ModmailThreadManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteModmailThread",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "modmailThread";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.modmailThreadId = this.modmailThreadId;
  }

  readRestParameters(request) {
    this.modmailThreadId = request.params?.modmailThreadId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.modmailThreadId = request.mcpParams.modmailThreadId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getModmailThreadById } = require("dbLayer");
    this.modmailThread = await getModmailThreadById(this.modmailThreadId);
    if (!this.modmailThread) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.modmailThreadId == null) {
      throw new BadRequestError("errMsg_modmailThreadIdisRequired");
    }

    // ID
    if (
      this.modmailThreadId &&
      !isValidObjectId(this.modmailThreadId) &&
      !isValidUUID(this.modmailThreadId)
    ) {
      throw new BadRequestError("errMsg_modmailThreadIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.modmailThread?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbDeleteModmailthread function to delete the modmailthread and return the result to the controller
    const modmailthread = await dbDeleteModmailthread(this);

    return modmailthread;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.modmailThreadId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = DeleteModmailThreadManager;
