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
const { dbListModmailmessages } = require("dbLayer");

class ListModmailMessagesManager extends ModmailMessageManager {
  constructor(request, controllerType) {
    super(request, {
      name: "listModmailMessages",
      controllerType: controllerType,
      pagination: true,
      defaultPageRowCount: 50,
      crudType: "getList",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "modmailMessages";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
  }

  readRestParameters(request) {
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {}

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.modmailMessages?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbListModmailmessages function to getList the modmailmessages and return the result to the controller
    const modmailmessages = await dbListModmailmessages(this);

    return modmailmessages;
  }

  async getRouteQuery() {
    return { $and: [{ isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = ListModmailMessagesManager;
