const ModmailMessageManager = require("./ModmailMessageManager");
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
const { dbGetModmailmessage } = require("dbLayer");

class GetModmailMessageManager extends ModmailMessageManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getModmailMessage",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "modmailMessage";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.modmailMessageId = this.modmailMessageId;
  }

  readRestParameters(request) {
    this.modmailMessageId = request.params?.modmailMessageId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.modmailMessageId = request.mcpParams.modmailMessageId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.modmailMessageId == null) {
      throw new BadRequestError("errMsg_modmailMessageIdisRequired");
    }

    // ID
    if (
      this.modmailMessageId &&
      !isValidObjectId(this.modmailMessageId) &&
      !isValidUUID(this.modmailMessageId)
    ) {
      throw new BadRequestError("errMsg_modmailMessageIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.modmailMessage?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetModmailmessage function to get the modmailmessage and return the result to the controller
    const modmailmessage = await dbGetModmailmessage(this);

    return modmailmessage;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.modmailMessageId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = GetModmailMessageManager;
