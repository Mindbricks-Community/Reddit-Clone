const AbuseFlagManager = require("./AbuseFlagManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { AbuseflagDeletedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbDeleteAbuseflag } = require("dbLayer");

class DeleteAbuseFlagManager extends AbuseFlagManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteAbuseFlag",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "abuseFlag";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.abuseFlagId = this.abuseFlagId;
  }

  readRestParameters(request) {
    this.abuseFlagId = request.params?.abuseFlagId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.abuseFlagId = request.mcpParams.abuseFlagId;
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

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbDeleteAbuseflag function to delete the abuseflag and return the result to the controller
    const abuseflag = await dbDeleteAbuseflag(this);

    return abuseflag;
  }

  async raiseEvent() {
    AbuseflagDeletedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getRouteQuery() {
    return { $and: [{ id: this.abuseFlagId }, { isActive: true }] };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = DeleteAbuseFlagManager;
