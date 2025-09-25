const AbuseFlagManager = require("./AbuseFlagManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { AbuseflagUpdatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateAbuseflag } = require("dbLayer");

class UpdateAbuseFlagManager extends AbuseFlagManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateAbuseFlag",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseFlag";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.abuseFlagId = this.abuseFlagId;
    jsonObj.flagStatus = this.flagStatus;
    jsonObj.details = this.details;
  }

  readRestParameters(request) {
    this.abuseFlagId = request.params?.abuseFlagId;
    this.flagStatus = request.body?.flagStatus;
    this.details = request.body?.details;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.abuseFlagId = request.mcpParams.abuseFlagId;
    this.flagStatus = request.mcpParams.flagStatus;
    this.details = request.mcpParams.details;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getAbuseFlagById } = require("dbLayer");
    this.abuseFlag = await getAbuseFlagById(this.abuseFlagId);
    if (!this.abuseFlag) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.abuseFlagId == null) {
      throw new BadRequestError("errMsg_abuseFlagIdisRequired");
    }

    // ID
    if (
      this.abuseFlagId &&
      !isValidObjectId(this.abuseFlagId) &&
      !isValidUUID(this.abuseFlagId)
    ) {
      throw new BadRequestError("errMsg_abuseFlagIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.abuseFlag?._owner === this.session.userId;
  }

  async checkLayer3BusinessValidations() {
    //check if the record is not already deleted
    if (this.abuseFlag?.isActive == false) {
      throw new NotFoundError("errMsg_abuseFlagObjectAlreadyDeleted");
    }

    //check Layer3 validations
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateAbuseflag function to update the abuseflag and return the result to the controller
    const abuseflag = await dbUpdateAbuseflag(this);

    return abuseflag;
  }

  async raiseEvent() {
    AbuseflagUpdatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getRouteQuery() {
    return { id: this.abuseFlagId };

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
      flagStatus: this.flagStatus,
      details: this.details
        ? typeof this.details == "string"
          ? JSON.parse(this.details)
          : this.details
        : null,
    };

    return dataClause;
  }
}

module.exports = UpdateAbuseFlagManager;
