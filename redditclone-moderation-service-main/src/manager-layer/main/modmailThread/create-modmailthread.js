const ModmailThreadManager = require("./ModmailThreadManager");
const { isValidObjectId, isValidUUID, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const {
  HttpServerError,
  BadRequestError,
  NotAuthenticatedError,
  ForbiddenError,
  NotFoundError,
} = require("common");
const { dbCreateModmailthread } = require("dbLayer");

class CreateModmailThreadManager extends ModmailThreadManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createModmailThread",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "modmailThread";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.communityId = this.communityId;
    jsonObj.subject = this.subject;
    jsonObj.createdByUserId = this.createdByUserId;
    jsonObj.status = this.status;
  }

  readRestParameters(request) {
    this.communityId = request.body?.communityId;
    this.subject = request.body?.subject;
    this.createdByUserId = request.session?.userId;
    this.status = request.body?.status;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.communityId = request.mcpParams.communityId;
    this.subject = request.mcpParams.subject;
    this.createdByUserId = request.session.userId;
    this.status = request.mcpParams.status;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.communityId == null) {
      throw new BadRequestError("errMsg_communityIdisRequired");
    }

    if (this.subject == null) {
      throw new BadRequestError("errMsg_subjectisRequired");
    }

    if (this.createdByUserId == null) {
      throw new BadRequestError("errMsg_createdByUserIdisRequired");
    }

    if (this.status == null) {
      throw new BadRequestError("errMsg_statusisRequired");
    }

    // ID
    if (
      this.communityId &&
      !isValidObjectId(this.communityId) &&
      !isValidUUID(this.communityId)
    ) {
      throw new BadRequestError("errMsg_communityIdisNotAValidID");
    }

    // ID
    if (
      this.createdByUserId &&
      !isValidObjectId(this.createdByUserId) &&
      !isValidUUID(this.createdByUserId)
    ) {
      throw new BadRequestError("errMsg_createdByUserIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.modmailThread?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateModmailthread function to create the modmailthread and return the result to the controller
    const modmailthread = await dbCreateModmailthread(this);

    return modmailthread;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.modmailThreadId = this.id;
    if (!this.modmailThreadId) this.modmailThreadId = newUUID(false);

    const dataClause = {
      id: this.modmailThreadId,
      communityId: this.communityId,
      subject: this.subject,
      createdByUserId: this.createdByUserId,
      status: this.status,
    };

    return dataClause;
  }
}

module.exports = CreateModmailThreadManager;
