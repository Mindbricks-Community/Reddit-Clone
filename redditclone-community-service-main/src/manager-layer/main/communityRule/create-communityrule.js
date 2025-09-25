const CommunityRuleManager = require("./CommunityRuleManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  CommunityruleCreatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateCommunityrule } = require("dbLayer");

class CreateCommunityRuleManager extends CommunityRuleManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createCommunityRule",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "communityRule";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.shortName = this.shortName;
    jsonObj.description = this.description;
    jsonObj.orderIndex = this.orderIndex;
  }

  readRestParameters(request) {
    this.shortName = request.body?.shortName;
    this.description = request.body?.description;
    this.orderIndex = request.body?.orderIndex;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.shortName = request.mcpParams.shortName;
    this.description = request.mcpParams.description;
    this.orderIndex = request.mcpParams.orderIndex;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.shortName == null) {
      throw new BadRequestError("errMsg_shortNameisRequired");
    }

    if (this.description == null) {
      throw new BadRequestError("errMsg_descriptionisRequired");
    }

    if (this.orderIndex == null) {
      throw new BadRequestError("errMsg_orderIndexisRequired");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.communityRule?._owner === this.session.userId;
  }

  async checkLayer3BusinessValidations() {
    //check if the record is not already deleted
    if (this.communityRule?.isActive == false) {
      throw new NotFoundError("errMsg_communityRuleObjectAlreadyDeleted");
    }

    //check Layer3 validations
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateCommunityrule function to create the communityrule and return the result to the controller
    const communityrule = await dbCreateCommunityrule(this);

    return communityrule;
  }

  async raiseEvent() {
    CommunityruleCreatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.communityRuleId = this.id;
    if (!this.communityRuleId) this.communityRuleId = newUUID(false);

    const dataClause = {
      id: this.communityRuleId,
      shortName: this.shortName,
      description: this.description,
      orderIndex: this.orderIndex,
    };

    return dataClause;
  }
}

module.exports = CreateCommunityRuleManager;
