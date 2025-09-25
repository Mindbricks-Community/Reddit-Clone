const CommunityManager = require("./CommunityManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { CommunityUpdatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateCommunity } = require("dbLayer");

class UpdateCommunityManager extends CommunityManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateCommunity",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "community";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityId = this.communityId;
    jsonObj.name = this.name;
    jsonObj.description = this.description;
    jsonObj.bannerUrl = this.bannerUrl;
    jsonObj.avatarUrl = this.avatarUrl;
    jsonObj.colorScheme = this.colorScheme;
    jsonObj.privacyLevel = this.privacyLevel;
    jsonObj.isNsfw = this.isNsfw;
    jsonObj.allowedPostTypes = this.allowedPostTypes;
  }

  readRestParameters(request) {
    this.communityId = request.params?.communityId;
    this.name = request.body?.name;
    this.description = request.body?.description;
    this.bannerUrl = request.body?.bannerUrl;
    this.avatarUrl = request.body?.avatarUrl;
    this.colorScheme = request.body?.colorScheme;
    this.privacyLevel = request.body?.privacyLevel;
    this.isNsfw = request.body?.isNsfw;
    this.allowedPostTypes = request.body?.allowedPostTypes;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.communityId = request.mcpParams.communityId;
    this.name = request.mcpParams.name;
    this.description = request.mcpParams.description;
    this.bannerUrl = request.mcpParams.bannerUrl;
    this.avatarUrl = request.mcpParams.avatarUrl;
    this.colorScheme = request.mcpParams.colorScheme;
    this.privacyLevel = request.mcpParams.privacyLevel;
    this.isNsfw = request.mcpParams.isNsfw;
    this.allowedPostTypes = request.mcpParams.allowedPostTypes;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getCommunityById } = require("dbLayer");
    this.community = await getCommunityById(this.communityId);
    if (!this.community) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.communityId == null) {
      throw new BadRequestError("errMsg_communityIdisRequired");
    }

    // ID
    if (
      this.communityId &&
      !isValidObjectId(this.communityId) &&
      !isValidUUID(this.communityId)
    ) {
      throw new BadRequestError("errMsg_communityIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.community?.creatorId === this.session.userId;
  }

  async checkLayer3BusinessValidations() {
    //check if the record is not already deleted
    if (this.community?.isActive == false) {
      throw new NotFoundError("errMsg_communityObjectAlreadyDeleted");
    }

    //check Layer3 validations
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateCommunity function to update the community and return the result to the controller
    const community = await dbUpdateCommunity(this);

    return community;
  }

  async raiseEvent() {
    CommunityUpdatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getRouteQuery() {
    return { id: this.communityId };

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
      name: this.name,
      description: this.description,
      bannerUrl: this.bannerUrl,
      avatarUrl: this.avatarUrl,
      colorScheme: this.colorScheme,
      privacyLevel: this.privacyLevel,
      isNsfw: this.isNsfw,
      allowedPostTypes: this.allowedPostTypes
        ? this.allowedPostTypes
        : this.allowedPostTypes_remove
          ? sequelize.fn(
              "array_remove",
              sequelize.col("allowedPostTypes"),
              this.allowedPostTypes_remove,
            )
          : this.allowedPostTypes_append
            ? sequelize.fn(
                "array_append",
                sequelize.col("allowedPostTypes"),
                this.allowedPostTypes_append,
              )
            : undefined,
    };

    return dataClause;
  }
}

module.exports = UpdateCommunityManager;
