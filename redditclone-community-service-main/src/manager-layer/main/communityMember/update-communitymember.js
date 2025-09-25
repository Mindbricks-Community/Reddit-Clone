const CommunityMemberManager = require("./CommunityMemberManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");
const {
  CommunitymemberUpdatedPublisher,
} = require("../../route-events/publishers");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbUpdateCommunitymember } = require("dbLayer");

class UpdateCommunityMemberManager extends CommunityMemberManager {
  constructor(request, controllerType) {
    super(request, {
      name: "updateCommunityMember",
      controllerType: controllerType,
      pagination: false,
      crudType: "update",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "communityMember";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityMemberId = this.communityMemberId;
    jsonObj.role = this.role;
    jsonObj.status = this.status;
  }

  readRestParameters(request) {
    this.communityMemberId = request.params?.communityMemberId;
    this.role = request.body?.role;
    this.status = request.body?.status;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.communityMemberId = request.mcpParams.communityMemberId;
    this.role = request.mcpParams.role;
    this.status = request.mcpParams.status;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  async fetchInstance() {
    const { getCommunityMemberById } = require("dbLayer");
    this.communityMember = await getCommunityMemberById(this.communityMemberId);
    if (!this.communityMember) {
      throw new NotFoundError("errMsg_RecordNotFound");
    }
  }

  checkParameters() {
    if (this.communityMemberId == null) {
      throw new BadRequestError("errMsg_communityMemberIdisRequired");
    }

    // ID
    if (
      this.communityMemberId &&
      !isValidObjectId(this.communityMemberId) &&
      !isValidUUID(this.communityMemberId)
    ) {
      throw new BadRequestError("errMsg_communityMemberIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.communityMember?.userId === this.session.userId;
  }

  async checkLayer3BusinessValidations() {
    //check if the record is not already deleted
    if (this.communityMember?.isActive == false) {
      throw new NotFoundError("errMsg_communityMemberObjectAlreadyDeleted");
    }

    //check Layer3 validations
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbUpdateCommunitymember function to update the communitymember and return the result to the controller
    const communitymember = await dbUpdateCommunitymember(this);

    return communitymember;
  }

  async raiseEvent() {
    CommunitymemberUpdatedPublisher.Publish(this.output, this.session).catch(
      (err) => {
        console.log("Publisher Error in Rest Controller:", err);
      },
    );
  }

  async getRouteQuery() {
    return { id: this.communityMemberId };

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
      role: this.role,
      status: this.status,
    };

    return dataClause;
  }
}

module.exports = UpdateCommunityMemberManager;
