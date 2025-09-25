const GdprDeleteRequestManager = require("./GdprDeleteRequestManager");
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
const { dbUpdateGdprdeleterequest } = require("dbLayer");

class UpdateGdprDeleteRequestManager extends GdprDeleteRequestManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateGdprDeleteRequest",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "gdprDeleteRequest";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.gdprDeleteRequestId = this.gdprDeleteRequestId;
    jsonObj.status = this.status;
    jsonObj.errorMsg = this.errorMsg;
  }

  readRestParameters(request) {
    this.gdprDeleteRequestId = request.params?.gdprDeleteRequestId;
    this.status = request.body?.status;
    this.errorMsg = request.body?.errorMsg;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.gdprDeleteRequestId = request.mcpParams.gdprDeleteRequestId;
    this.status = request.mcpParams.status;
    this.errorMsg = request.mcpParams.errorMsg;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getGdprDeleteRequestById } = require("dbLayer");
    this.gdprDeleteRequest = await getGdprDeleteRequestById(
      this.gdprDeleteRequestId,
    );
    if (!this.gdprDeleteRequest) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.gdprDeleteRequestId == null) {
      throw new BadRequestError("errMsg_gdprDeleteRequestIdisRequired");
    }

    // ID
    if (
      this.gdprDeleteRequestId &&
      !isValidObjectId(this.gdprDeleteRequestId) &&
      !isValidUUID(this.gdprDeleteRequestId)
    ) {
      throw new BadRequestError("errMsg_gdprDeleteRequestIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.gdprDeleteRequest?._owner === this.session.userId;
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
    // make an awaited call to the dbUpdateGdprdeleterequest function to update the gdprdeleterequest and return the result to the controller
    const gdprdeleterequest = await dbUpdateGdprdeleterequest(this);

    return gdprdeleterequest;
  }

  async getRouteQuery() {
    return { $and: [{ id: this.gdprDeleteRequestId }, { isActive: true }] };

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
      status: this.status,
      errorMsg: this.errorMsg,
    };

    return dataClause;
  }
}

module.exports = UpdateGdprDeleteRequestManager;
