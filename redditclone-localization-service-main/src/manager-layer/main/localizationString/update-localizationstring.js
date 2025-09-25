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
const { dbUpdateLocalizationstring } = require("dbLayer");

class UpdateLocalizationStringManager extends LocalizationStringManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateLocalizationString",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "localizationString";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.localizationStringId = this.localizationStringId;
    jsonObj.value = this.value;
    jsonObj.status = this.status;
    jsonObj.reviewNotes = this.reviewNotes;
  }

  readRestParameters(request) {
    this.localizationStringId = request.params?.localizationStringId;
    this.value = request.body?.value;
    this.status = request.body?.status;
    this.reviewNotes = request.body?.reviewNotes;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.localizationStringId = request.mcpParams.localizationStringId;
    this.value = request.mcpParams.value;
    this.status = request.mcpParams.status;
    this.reviewNotes = request.mcpParams.reviewNotes;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getLocalizationStringById } = require("dbLayer");
    this.localizationString = await getLocalizationStringById(
      this.localizationStringId,
    );
    if (!this.localizationString) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.localizationStringId == null) {
      throw new BadRequestError("errMsg_localizationStringIdisRequired");
    }

    // ID
    if (
      this.localizationStringId &&
      !isValidObjectId(this.localizationStringId) &&
      !isValidUUID(this.localizationStringId)
    ) {
      throw new BadRequestError("errMsg_localizationStringIdisNotAValidID");
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
    // make an awaited call to the dbUpdateLocalizationstring function to update the localizationstring and return the result to the controller
    const localizationstring = await dbUpdateLocalizationstring(this);

    return localizationstring;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.localizationStringId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      value: this.value,
      status: this.status,
      reviewNotes: this.reviewNotes,
    };

    return dataClause;
  }
}

module.exports = UpdateLocalizationStringManager;
