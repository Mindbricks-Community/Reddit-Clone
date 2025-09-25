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
const { dbDeleteLocalizationkey } = require("dbLayer");

class DeleteLocalizationKeyManager extends LocalizationKeyManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteLocalizationKey",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "localizationKey";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.localizationKeyId = this.localizationKeyId;
  }

  readRestParameters(request) {
    this.localizationKeyId = request.params?.localizationKeyId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.localizationKeyId = request.mcpParams.localizationKeyId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getLocalizationKeyById } = require("dbLayer");
    this.localizationKey = await getLocalizationKeyById(this.localizationKeyId);
    if (!this.localizationKey) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.localizationKeyId == null) {
      throw new BadRequestError("errMsg_localizationKeyIdisRequired");
    }

    // ID
    if (
      this.localizationKeyId &&
      !isValidObjectId(this.localizationKeyId) &&
      !isValidUUID(this.localizationKeyId)
    ) {
      throw new BadRequestError("errMsg_localizationKeyIdisNotAValidID");
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
    // make an awaited call to the dbDeleteLocalizationkey function to delete the localizationkey and return the result to the controller
    const localizationkey = await dbDeleteLocalizationkey(this);

    return localizationkey;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.localizationKeyId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = DeleteLocalizationKeyManager;
