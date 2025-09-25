const CommunityManager = require("./CommunityManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const { CommunityDeletedPublisher } = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbDeleteCommunity } = require("dbLayer");

class DeleteCommunityManager extends CommunityManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteCommunity",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "community";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityId = this.communityId;
  }

  readRestParameters(request) {
    this.communityId = request.params?.communityId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.communityId = request.mcpParams.communityId;
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
    // make an awaited call to the dbDeleteCommunity function to delete the community and return the result to the controller
    const community = await dbDeleteCommunity(this);

    return community;
  }

  async raiseEvent() {
    CommunityDeletedPublisher.Publish(this.output, this.session).catch(
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
}

module.exports = DeleteCommunityManager;
