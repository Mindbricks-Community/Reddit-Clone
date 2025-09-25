const LocaleManager = require("./LocaleManager");
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
const { dbGetLocale } = require("dbLayer");

class GetLocaleManager extends LocaleManager {
  constructor(request, controllerType) {
    super(request, {
      name: "getLocale",
      controllerType: controllerType,
      pagination: false,
      crudType: "get",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "locale";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.localeId = this.localeId;
  }

  readRestParameters(request) {
    this.localeId = request.params?.localeId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.localeId = request.mcpParams.localeId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.localeId == null) {
      throw new BadRequestError("errMsg_localeIdisRequired");
    }

    // ID
    if (
      this.localeId &&
      !isValidObjectId(this.localeId) &&
      !isValidUUID(this.localeId)
    ) {
      throw new BadRequestError("errMsg_localeIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.locale?._owner === this.session.userId;
  }

  checkAbsolute() {
    // Check if user has an absolute role to ignore all authorization validations and return
    if (this.userHasRole(this.ROLES.admin)) {
      this.absoluteAuth = true;
      return true;
    }
    return false;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbGetLocale function to get the locale and return the result to the controller
    const locale = await dbGetLocale(this);

    return locale;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.localeId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = GetLocaleManager;
