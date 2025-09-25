const LocalizationStringManager = require("./LocalizationStringManager");
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
const { dbCreateLocalizationstring } = require("dbLayer");

class CreateLocalizationStringManager extends LocalizationStringManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createLocalizationString",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "localizationString";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.keyId = this.keyId;
    jsonObj.localeId = this.localeId;
    jsonObj.value = this.value;
    jsonObj.status = this.status;
    jsonObj.reviewNotes = this.reviewNotes;
  }

  readRestParameters(request) {
    this.keyId = request.body?.keyId;
    this.localeId = request.body?.localeId;
    this.value = request.body?.value;
    this.status = request.body?.status;
    this.reviewNotes = request.body?.reviewNotes;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.keyId = request.mcpParams.keyId;
    this.localeId = request.mcpParams.localeId;
    this.value = request.mcpParams.value;
    this.status = request.mcpParams.status;
    this.reviewNotes = request.mcpParams.reviewNotes;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.keyId == null) {
      throw new BadRequestError("errMsg_keyIdisRequired");
    }

    if (this.localeId == null) {
      throw new BadRequestError("errMsg_localeIdisRequired");
    }

    if (this.value == null) {
      throw new BadRequestError("errMsg_valueisRequired");
    }

    if (this.status == null) {
      throw new BadRequestError("errMsg_statusisRequired");
    }

    // ID
    if (
      this.keyId &&
      !isValidObjectId(this.keyId) &&
      !isValidUUID(this.keyId)
    ) {
      throw new BadRequestError("errMsg_keyIdisNotAValidID");
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

    this.isOwner = this.localizationString?._owner === this.session.userId;
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
    // make an awaited call to the dbCreateLocalizationstring function to create the localizationstring and return the result to the controller
    const localizationstring = await dbCreateLocalizationstring(this);

    return localizationstring;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.localizationStringId = this.id;
    if (!this.localizationStringId) this.localizationStringId = newUUID(false);

    const dataClause = {
      id: this.localizationStringId,
      keyId: this.keyId,
      localeId: this.localeId,
      value: this.value,
      status: this.status,
      reviewNotes: this.reviewNotes,
    };

    return dataClause;
  }
}

module.exports = CreateLocalizationStringManager;
