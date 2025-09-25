const CompliancePolicyManager = require("./CompliancePolicyManager");
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
const { dbCreateCompliancepolicy } = require("dbLayer");

class CreateCompliancePolicyManager extends CompliancePolicyManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createCompliancePolicy",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "compliancePolicy";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.minAge = this.minAge;
    jsonObj.gdprExportEnabled = this.gdprExportEnabled;
    jsonObj.gdprDeleteEnabled = this.gdprDeleteEnabled;
  }

  readRestParameters(request) {
    this.minAge = request.body?.minAge;
    this.gdprExportEnabled = request.body?.gdprExportEnabled;
    this.gdprDeleteEnabled = request.body?.gdprDeleteEnabled;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.minAge = request.mcpParams.minAge;
    this.gdprExportEnabled = request.mcpParams.gdprExportEnabled;
    this.gdprDeleteEnabled = request.mcpParams.gdprDeleteEnabled;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.minAge == null) {
      throw new BadRequestError("errMsg_minAgeisRequired");
    }

    if (this.gdprExportEnabled == null) {
      throw new BadRequestError("errMsg_gdprExportEnabledisRequired");
    }

    if (this.gdprDeleteEnabled == null) {
      throw new BadRequestError("errMsg_gdprDeleteEnabledisRequired");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.compliancePolicy?._owner === this.session.userId;
  }

  checkAbsolute() {
    // Check if user has an absolute role to ignore all authorization validations and return
    if (this.userHasRole(this.ROLES.admin)) {
      this.absoluteAuth = true;
      return true;
    }
    return false;
  }

  async checkLayer1AuthValidations() {
    //check "403" validations

    // Validation Check: routeRoleCheck
    // Check if the logged in user has [admin] roles
    if (!this.userHasRole(this.ROLES.admin)) {
      throw new ForbiddenError("errMsg_userShoudlHave[admin]RoleToAccessRoute");
    }
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateCompliancepolicy function to create the compliancepolicy and return the result to the controller
    const compliancepolicy = await dbCreateCompliancepolicy(this);

    return compliancepolicy;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.compliancePolicyId = this.id;
    if (!this.compliancePolicyId) this.compliancePolicyId = newUUID(false);

    const dataClause = {
      id: this.compliancePolicyId,
      minAge: this.minAge,
      gdprExportEnabled: this.gdprExportEnabled,
      gdprDeleteEnabled: this.gdprDeleteEnabled,
    };

    return dataClause;
  }
}

module.exports = CreateCompliancePolicyManager;
