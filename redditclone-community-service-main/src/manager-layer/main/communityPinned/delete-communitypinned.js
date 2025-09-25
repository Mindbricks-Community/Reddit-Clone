const CommunityPinnedManager = require("./CommunityPinnedManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  CommunitypinnedDeletedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbDeleteCommunitypinned } = require("dbLayer");

class DeleteCommunityPinnedManager extends CommunityPinnedManager {
  constructor(request, controllerType) {
    super(request, {
      name: "deleteCommunityPinned",
      controllerType: controllerType,
      pagination: false,
      crudType: "delete",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "communityPinned";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityPinnedId = this.communityPinnedId;
  }

  readRestParameters(request) {
    this.communityPinnedId = request.params?.communityPinnedId;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.communityPinnedId = request.mcpParams.communityPinnedId;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getCommunityPinnedById } = require("dbLayer");
    this.communityPinned = await getCommunityPinnedById(this.communityPinnedId);
    if (!this.communityPinned) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.communityPinnedId == null) {
      throw new BadRequestError("errMsg_communityPinnedIdisRequired");
    }

    // ID
    if (
      this.communityPinnedId &&
      !isValidObjectId(this.communityPinnedId) &&
      !isValidUUID(this.communityPinnedId)
    ) {
      throw new BadRequestError("errMsg_communityPinnedIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.communityPinned?._owner === this.session.userId;
  }

  async checkLayer3BusinessValidations() {
    //check if the record is not already deleted
    if (this.communityPinned?.isActive == false) {
      throw new NotFoundError("errMsg_communityPinnedObjectAlreadyDeleted");
    }

    //check Layer3 validations
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbDeleteCommunitypinned function to delete the communitypinned and return the result to the controller
    const communitypinned = await dbDeleteCommunitypinned(this);

    return communitypinned;
  }

  async raiseEvent() {
    CommunitypinnedDeletedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getRouteQuery() {
    return { id: this.communityPinnedId };

    // handle permission filter later
  }

  async getWhereClause() {
    const { convertUserQueryToSequelizeQuery } = require("common");

    const routeQuery = await this.getRouteQuery();

    return convertUserQueryToSequelizeQuery(routeQuery);
  }
}

module.exports = DeleteCommunityPinnedManager;
