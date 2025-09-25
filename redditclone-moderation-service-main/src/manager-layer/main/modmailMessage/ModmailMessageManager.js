const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const ModerationServiceManager = require("../../service-manager/ModerationServiceManager");

/* Base Class For the Crud Routes Of DbObject ModmailMessage */
class ModmailMessageManager extends ModerationServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "modmailMessage";
    this.modelName = "ModmailMessage";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = ModmailMessageManager;
