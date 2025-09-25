const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const ModerationServiceManager = require("../../service-manager/ModerationServiceManager");

/* Base Class For the Crud Routes Of DbObject ModerationAuditLog */
class ModerationAuditLogManager extends ModerationServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "moderationAuditLog";
    this.modelName = "ModerationAuditLog";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = ModerationAuditLogManager;
