const CommunityAutomodSettingManager = require("./CommunityAutomodSettingManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  CommunityautomodsettingDeletedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbDeleteCommunityautomodsetting } = require("dbLayer");

class DeleteCommunityAutomodSettingManager extends CommunityAutomodSettingManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteCommunityAutomodSetting",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "communityAutomodSetting";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityAutomodSettingId = this.communityAutomodSettingId;
  }

  readRestParameters(request) {
    this.communityAutomodSettingId = request.params?.communityAutomodSettingId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.communityAutomodSettingId =
      request.mcpParams.communityAutomodSettingId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getCommunityAutomodSettingById } = require("dbLayer");
    this.communityAutomodSetting = await getCommunityAutomodSettingById(
      this.communityAutomodSettingId,
    );
    if (!this.communityAutomodSetting) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.communityAutomodSettingId == null) {
      throw new BadRequestError("errMsg_communityAutomodSettingIdisRequired");
    }

    // ID
    if (
      this.communityAutomodSettingId &&
      !isValidObjectId(this.communityAutomodSettingId) &&
      !isValidUUID(this.communityAutomodSettingId)
    ) {
      throw new BadRequestError(
        "errMsg_communityAutomodSettingIdisNotAValidID",
      );
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.communityAutomodSetting?._owner === this.session.userId;
  }

  async checkLayer3BusinessValidations() {
    //check if the record is not already deleted
    if (this.communityAutomodSetting?.isActive == false) {
      throw new NotFoundError(
        "errMsg_communityAutomodSettingObjectAlreadyDeleted",
      );
    }

    //check Layer3 validations
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbDeleteCommunityautomodsetting function to delete the communityautomodsetting and return the result to the controller
    const communityautomodsetting = await dbDeleteCommunityautomodsetting(this);

    return communityautomodsetting;
  }

  async raiseEvent() {
    CommunityautomodsettingDeletedPublisher.Publish(
      this.output,
      this.session,
    ).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getRouteQuery() {
    return { id: this.communityAutomodSettingId };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = DeleteCommunityAutomodSettingManager;
