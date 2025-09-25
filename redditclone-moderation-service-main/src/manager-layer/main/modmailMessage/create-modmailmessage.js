const ModmailMessageManager = require("./ModmailMessageManager");
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
const { dbCreateModmailmessage } = require("dbLayer");

class CreateModmailMessageManager extends ModmailMessageManager {
  constructor(request, controllerType) {
    super(request, {
      name: "createModmailMessage",
      controllerType: controllerType,
      pagination: false,
      crudType: "create",
      loginRequired: true,
      hasShareToken: false,
    });

    this.dataName = "modmailMessage";
  }

  parametersToJson(jsonObj) {
    super.parametersToJson(jsonObj);
    jsonObj.threadId = this.threadId;
    jsonObj.senderUserId = this.senderUserId;
    jsonObj.messageBody = this.messageBody;
    jsonObj.messageType = this.messageType;
  }

  readRestParameters(request) {
    this.threadId = request.body?.threadId;
    this.senderUserId = request.session?.userId;
    this.messageBody = request.body?.messageBody;
    this.messageType = request.body?.messageType;
    this.id = request.body?.id ?? request.query?.id ?? request.id;
    this.requestData = request.body;
    this.queryData = request.query ?? {};
    const url = request.url;
    this.urlPath = url.slice(1).split("/").join(".");
  }

  readMcpParameters(request) {
    this.threadId = request.mcpParams.threadId;
    this.senderUserId = request.session.userId;
    this.messageBody = request.mcpParams.messageBody;
    this.messageType = request.mcpParams.messageType;
    this.id = request.mcpParams?.id;
    this.requestData = request.mcpParams;
  }

  async transformParameters() {}

  async setVariables() {}

  checkParameters() {
    if (this.threadId == null) {
      throw new BadRequestError("errMsg_threadIdisRequired");
    }

    if (this.senderUserId == null) {
      throw new BadRequestError("errMsg_senderUserIdisRequired");
    }

    if (this.messageBody == null) {
      throw new BadRequestError("errMsg_messageBodyisRequired");
    }

    if (this.messageType == null) {
      throw new BadRequestError("errMsg_messageTypeisRequired");
    }

    // ID
    if (
      this.threadId &&
      !isValidObjectId(this.threadId) &&
      !isValidUUID(this.threadId)
    ) {
      throw new BadRequestError("errMsg_threadIdisNotAValidID");
    }

    // ID
    if (
      this.senderUserId &&
      !isValidObjectId(this.senderUserId) &&
      !isValidUUID(this.senderUserId)
    ) {
      throw new BadRequestError("errMsg_senderUserIdisNotAValidID");
    }
  }

  setOwnership() {
    this.isOwner = false;
    if (!this.session || !this.session.userId) return;

    this.isOwner = this.modmailMessage?._owner === this.session.userId;
  }

  async doBusiness() {
    // Call DbFunction
    // make an awaited call to the dbCreateModmailmessage function to create the modmailmessage and return the result to the controller
    const modmailmessage = await dbCreateModmailmessage(this);

    return modmailmessage;
  }

  async getDataClause() {
    const { newUUID } = require("common");

    const { hashString } = require("common");

    if (this.id) this.modmailMessageId = this.id;
    if (!this.modmailMessageId) this.modmailMessageId = newUUID(false);

    const dataClause = {
      id: this.modmailMessageId,
      threadId: this.threadId,
      senderUserId: this.senderUserId,
      messageBody: this.messageBody,
      messageType: this.messageType,
    };

    return dataClause;
  }
}

module.exports = CreateModmailMessageManager;
