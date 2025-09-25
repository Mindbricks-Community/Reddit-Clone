const CommunityAutomodSettingManager = require("./CommunityAutomodSettingManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  CommunityautomodsettingUpdatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateCommunityautomodsetting } = require("dbLayer");

class UpdateCommunityAutomodSettingManager extends CommunityAutomodSettingManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateCommunityAutomodSetting",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "communityAutomodSetting";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityAutomodSettingId = this.communityAutomodSettingId;
    jsonObj.rulesData = this.rulesData;
  }

  readRestParameters(request) {
    this.communityAutomodSettingId = request.params?.communityAutomodSettingId;
    this.rulesData = request.body?.rulesData;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.communityAutomodSettingId =
      request.mcpParams.communityAutomodSettingId;
    this.rulesData = request.mcpParams.rulesData;
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
    // make an awaited call to the dbUpdateCommunityautomodsetting function to update the communityautomodsetting and return the result to the controller
    const communityautomodsetting = await dbUpdateCommunityautomodsetting(this);

    return communityautomodsetting;
  }

  async raiseEvent() {
    CommunityautomodsettingUpdatedPublisher.Publish(
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

  async getDataClause() {
    const { hashString } = require("common");

    const dataClause = {
      rulesData: this.rulesData
        ? typeof this.rulesData == "string"
          ? JSON.parse(this.rulesData)
          : this.rulesData
        : null,
    };

    return dataClause;
  }
}

module.exports = UpdateCommunityAutomodSettingManager;
