const CommunityAutomodSettingManager = require("./CommunityAutomodSettingManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  CommunityautomodsettingCreatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateCommunityautomodsetting } = require("dbLayer");

class CreateCommunityAutomodSettingManager extends CommunityAutomodSettingManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createCommunityAutomodSetting",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "communityAutomodSetting";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.rulesData = this.rulesData;
  }

  readRestParameters(request) {
    this.rulesData = request.body?.rulesData;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.rulesData = request.mcpParams.rulesData;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.rulesData == null) {
      throw new BadRequestError("errMsg_rulesDataisRequired");
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
    // make an awaited call to the dbCreateCommunityautomodsetting function to create the communityautomodsetting and return the result to the controller
    const communityautomodsetting = await dbCreateCommunityautomodsetting(this);

    return communityautomodsetting;
  }

  async raiseEvent() {
    CommunityautomodsettingCreatedPublisher.Publish(
      this.output,
      this.session,
    ).catch((err) => {
      console.log("Publisher Error in Rest Controller:", err);
    });
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.communityAutomodSettingId = this.id;
    if (!this.communityAutomodSettingId)
      this.communityAutomodSettingId = newUUID(false);

    const dataClause = {
      id: this.communityAutomodSettingId,
      rulesData: this.rulesData
        ? typeof this.rulesData == "string"
          ? JSON.parse(this.rulesData)
          : this.rulesData
        : null,
    };

    return dataClause;
  }
}

module.exports = CreateCommunityAutomodSettingManager;
