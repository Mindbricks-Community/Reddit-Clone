const LocalizationKeyManager = require("./LocalizationKeyManager");
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
const { dbCreateLocalizationkey } = require("dbLayer");

class CreateLocalizationKeyManager extends LocalizationKeyManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createLocalizationKey",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "localizationKey";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.uiKey = this.uiKey;
    jsonObj.description = this.description;
    jsonObj.defaultValue = this.defaultValue;
  }

  readRestParameters(request) {
    this.uiKey = request.body?.uiKey;
    this.description = request.body?.description;
    this.defaultValue = request.body?.defaultValue;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.uiKey = request.mcpParams.uiKey;
    this.description = request.mcpParams.description;
    this.defaultValue = request.mcpParams.defaultValue;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.uiKey == null) {
      throw new BadRequestError("errMsg_uiKeyisRequired");
    }

    if (this.defaultValue == null) {
      throw new BadRequestError("errMsg_defaultValueisRequired");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.localizationKey?._owner === this.session.userId;
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
    // make an awaited call to the dbCreateLocalizationkey function to create the localizationkey and return the result to the controller
    const localizationkey = await dbCreateLocalizationkey(this);

    return localizationkey;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.localizationKeyId = this.id;
    if (!this.localizationKeyId) this.localizationKeyId = newUUID(false);

    const dataClause = {
      id: this.localizationKeyId,
      uiKey: this.uiKey,
      description: this.description,
      defaultValue: this.defaultValue,
    };

    return dataClause;
  }
}

module.exports = CreateLocalizationKeyManager;
