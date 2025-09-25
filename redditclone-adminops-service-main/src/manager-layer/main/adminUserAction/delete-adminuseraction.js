const AdminUserActionManager = require("./AdminUserActionManager");
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
const { dbDeleteAdminuseraction } = require("dbLayer");

class DeleteAdminUserActionManager extends AdminUserActionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteAdminUserAction",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "adminUserAction";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.adminUserActionId = this.adminUserActionId;
  }

  readRestParameters(request) {
    this.adminUserActionId = request.params?.adminUserActionId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.adminUserActionId = request.mcpParams.adminUserActionId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getAdminUserActionById } = require("dbLayer");
    this.adminUserAction = await getAdminUserActionById(this.adminUserActionId);
    if (!this.adminUserAction) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.adminUserActionId == null) {
      throw new BadRequestError("errMsg_adminUserActionIdisRequired");
    }

    // ID
    if (
      this.adminUserActionId &&
      !isValidObjectId(this.adminUserActionId) &&
      !isValidUUID(this.adminUserActionId)
    ) {
      throw new BadRequestError("errMsg_adminUserActionIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.adminUserAction?._owner === this.session.userId;
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
    // make an awaited call to the dbDeleteAdminuseraction function to delete the adminuseraction and return the result to the controller
    const adminuseraction = await dbDeleteAdminuseraction(this);

    return adminuseraction;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.adminUserActionId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = DeleteAdminUserActionManager;
