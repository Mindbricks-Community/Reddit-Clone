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
const { dbCreateAdminuseraction } = require("dbLayer");

class CreateAdminUserActionManager extends AdminUserActionManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createAdminUserAction",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "adminUserAction";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.adminId = this.adminId;
    jsonObj.targetType = this.targetType;
    jsonObj.targetId = this.targetId;
    jsonObj.actionType = this.actionType;
    jsonObj.reason = this.reason;
    jsonObj.notes = this.notes;
  }

  readRestParameters(request) {
    this.adminId = request.body?.adminId;
    this.targetType = request.body?.targetType;
    this.targetId = request.body?.targetId;
    this.actionType = request.body?.actionType;
    this.reason = request.body?.reason;
    this.notes = request.body?.notes;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.adminId = request.mcpParams.adminId;
    this.targetType = request.mcpParams.targetType;
    this.targetId = request.mcpParams.targetId;
    this.actionType = request.mcpParams.actionType;
    this.reason = request.mcpParams.reason;
    this.notes = request.mcpParams.notes;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.adminId == null) {
      throw new BadRequestError("errMsg_adminIdisRequired");
    }

    if (this.targetType == null) {
      throw new BadRequestError("errMsg_targetTypeisRequired");
    }

    if (this.targetId == null) {
      throw new BadRequestError("errMsg_targetIdisRequired");
    }

    if (this.actionType == null) {
      throw new BadRequestError("errMsg_actionTypeisRequired");
    }

    // ID
    if (
      this.adminId &&
      !isValidObjectId(this.adminId) &&
      !isValidUUID(this.adminId)
    ) {
      throw new BadRequestError("errMsg_adminIdisNotAValidID");
    }

    // ID
    if (
      this.targetId &&
      !isValidObjectId(this.targetId) &&
      !isValidUUID(this.targetId)
    ) {
      throw new BadRequestError("errMsg_targetIdisNotAValidID");
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
    // make an awaited call to the dbCreateAdminuseraction function to create the adminuseraction and return the result to the controller
    const adminuseraction = await dbCreateAdminuseraction(this);

    return adminuseraction;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.adminUserActionId = this.id;
    if (!this.adminUserActionId) this.adminUserActionId = newUUID(false);

    const dataClause = {
      id: this.adminUserActionId,
      adminId: this.adminId,
      targetType: this.targetType,
      targetId: this.targetId,
      actionType: this.actionType,
      reason: this.reason,
      notes: this.notes,
    };

    return dataClause;
  }
}

module.exports = CreateAdminUserActionManager;
