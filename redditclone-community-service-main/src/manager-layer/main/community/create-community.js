const CommunityManager = require("./CommunityManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { CommunityCreatedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateCommunity } = require("dbLayer");

class CreateCommunityManager extends CommunityManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createCommunity",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "community";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.name = this.name;
    jsonObj.slug = this.slug;
    jsonObj.description = this.description;
    jsonObj.bannerUrl = this.bannerUrl;
    jsonObj.avatarUrl = this.avatarUrl;
    jsonObj.colorScheme = this.colorScheme;
  }

  readRestParameters(request) {
    this.name = request.body?.name;
    this.slug = request.body?.slug;
    this.description = request.body?.description;
    this.bannerUrl = request.body?.bannerUrl;
    this.avatarUrl = request.body?.avatarUrl;
    this.colorScheme = request.body?.colorScheme;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.name = request.mcpParams.name;
    this.slug = request.mcpParams.slug;
    this.description = request.mcpParams.description;
    this.bannerUrl = request.mcpParams.bannerUrl;
    this.avatarUrl = request.mcpParams.avatarUrl;
    this.colorScheme = request.mcpParams.colorScheme;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.name == null) {
      throw new BadRequestError("errMsg_nameisRequired");
    }

    if (this.slug == null) {
      throw new BadRequestError("errMsg_slugisRequired");
    }

    if (this.description == null) {
      throw new BadRequestError("errMsg_descriptionisRequired");
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
    // make an awaited call to the dbCreateCommunity function to create the community and return the result to the controller
    const community = await dbCreateCommunity(this);

    return community;
  }

  async raiseEvent() {
    CommunityCreatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.communityId = this.id;
    if (!this.communityId) this.communityId = newUUID(false);

    const dataClause = {
      id: this.communityId,
      name: this.name,
      slug: this.slug,
      description: this.description,
      bannerUrl: this.bannerUrl,
      avatarUrl: this.avatarUrl,
      colorScheme: this.colorScheme,
    };

    return dataClause;
  }
}

module.exports = CreateCommunityManager;
