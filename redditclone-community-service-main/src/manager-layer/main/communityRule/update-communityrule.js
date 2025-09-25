const CommunityRuleManager = require("./CommunityRuleManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  CommunityruleUpdatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateCommunityrule } = require("dbLayer");

class UpdateCommunityRuleManager extends CommunityRuleManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateCommunityRule",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "communityRule";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityRuleId = this.communityRuleId;
    jsonObj.shortName = this.shortName;
    jsonObj.description = this.description;
    jsonObj.orderIndex = this.orderIndex;
  }

  readRestParameters(request) {
    this.communityRuleId = request.params?.communityRuleId;
    this.shortName = request.body?.shortName;
    this.description = request.body?.description;
    this.orderIndex = request.body?.orderIndex;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.communityRuleId = request.mcpParams.communityRuleId;
    this.shortName = request.mcpParams.shortName;
    this.description = request.mcpParams.description;
    this.orderIndex = request.mcpParams.orderIndex;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getCommunityRuleById } = require("dbLayer");
    this.communityRule = await getCommunityRuleById(this.communityRuleId);
    if (!this.communityRule) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.communityRuleId == null) {
      throw new BadRequestError("errMsg_communityRuleIdisRequired");
    }

    // ID
    if (
      this.communityRuleId &&
      !isValidObjectId(this.communityRuleId) &&
      !isValidUUID(this.communityRuleId)
    ) {
      throw new BadRequestError("errMsg_communityRuleIdisNotAValidID");
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
    // make an awaited call to the dbUpdateCommunityrule function to update the communityrule and return the result to the controller
    const communityrule = await dbUpdateCommunityrule(this);

    return communityrule;
  }

  async raiseEvent() {
    CommunityruleUpdatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getRouteQuery() {
    return { id: this.communityRuleId };

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
      shortName: this.shortName,
      description: this.description,
      orderIndex: this.orderIndex,
    };

    return dataClause;
  }
}

module.exports = UpdateCommunityRuleManager;
