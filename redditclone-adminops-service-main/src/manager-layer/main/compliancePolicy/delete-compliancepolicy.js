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
const { dbDeleteCompliancepolicy } = require("dbLayer");

class DeleteCompliancePolicyManager extends CompliancePolicyManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteCompliancePolicy",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "compliancePolicy";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.compliancePolicyId = this.compliancePolicyId;
  }

  readRestParameters(request) {
    this.compliancePolicyId = request.params?.compliancePolicyId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.compliancePolicyId = request.mcpParams.compliancePolicyId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getCompliancePolicyById } = require("dbLayer");
    this.compliancePolicy = await getCompliancePolicyById(
      this.compliancePolicyId,
    );
    if (!this.compliancePolicy) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.compliancePolicyId == null) {
      throw new BadRequestError("errMsg_compliancePolicyIdisRequired");
    }

    // ID
    if (
      this.compliancePolicyId &&
      !isValidObjectId(this.compliancePolicyId) &&
      !isValidUUID(this.compliancePolicyId)
    ) {
      throw new BadRequestError("errMsg_compliancePolicyIdisNotAValidID");
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
    // make an awaited call to the dbDeleteCompliancepolicy function to delete the compliancepolicy and return the result to the controller
    const compliancepolicy = await dbDeleteCompliancepolicy(this);

    return compliancepolicy;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.compliancePolicyId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = DeleteCompliancePolicyManager;
