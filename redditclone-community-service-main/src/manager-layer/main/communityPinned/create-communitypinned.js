const CommunityPinnedManager = require("./CommunityPinnedManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  CommunitypinnedCreatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateCommunitypinned } = require("dbLayer");

class CreateCommunityPinnedManager extends CommunityPinnedManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createCommunityPinned",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "communityPinned";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.orderIndex = this.orderIndex;
  }

  readRestParameters(request) {
    this.orderIndex = request.body?.orderIndex;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.orderIndex = request.mcpParams.orderIndex;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.orderIndex == null) {
      throw new BadRequestError("errMsg_orderIndexisRequired");
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
    // make an awaited call to the dbCreateCommunitypinned function to create the communitypinned and return the result to the controller
    const communitypinned = await dbCreateCommunitypinned(this);

    return communitypinned;
  }

  async raiseEvent() {
    CommunitypinnedCreatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.communityPinnedId = this.id;
    if (!this.communityPinnedId) this.communityPinnedId = newUUID(false);

    const dataClause = {
      id: this.communityPinnedId,
      orderIndex: this.orderIndex,
    };

    return dataClause;
  }
}

module.exports = CreateCommunityPinnedManager;
