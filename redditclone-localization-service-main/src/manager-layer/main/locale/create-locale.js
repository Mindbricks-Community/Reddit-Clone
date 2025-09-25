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
const { dbCreateLocale } = require("dbLayer");

class CreateLocaleManager extends LocaleManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createLocale",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "locale";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.localeCode = this.localeCode;
    jsonObj.displayName = this.displayName;
    jsonObj.direction = this.direction;
    jsonObj.enabled = this.enabled;
  }

  readRestParameters(request) {
    this.localeCode = request.body?.localeCode;
    this.displayName = request.body?.displayName;
    this.direction = request.body?.direction;
    this.enabled = request.body?.enabled;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.localeCode = request.mcpParams.localeCode;
    this.displayName = request.mcpParams.displayName;
    this.direction = request.mcpParams.direction;
    this.enabled = request.mcpParams.enabled;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.localeCode == null) {
      throw new BadRequestError("errMsg_localeCodeisRequired");
    }

    if (this.displayName == null) {
      throw new BadRequestError("errMsg_displayNameisRequired");
    }

    if (this.direction == null) {
      throw new BadRequestError("errMsg_directionisRequired");
    }

    if (this.enabled == null) {
      throw new BadRequestError("errMsg_enabledisRequired");
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
    // make an awaited call to the dbCreateLocale function to create the locale and return the result to the controller
    const locale = await dbCreateLocale(this);

    return locale;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.localeId = this.id;
    if (!this.localeId) this.localeId = newUUID(false);

    const dataClause = {
      id: this.localeId,
      localeCode: this.localeCode,
      displayName: this.displayName,
      direction: this.direction,
      enabled: this.enabled,
    };

    return dataClause;
  }
}

module.exports = CreateLocaleManager;
