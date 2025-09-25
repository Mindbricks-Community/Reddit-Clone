const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const ModerationServiceManager = require("../../service-manager/ModerationServiceManager");

/* Base Class For the Crud Routes Of DbObject ModerationAction */
class ModerationActionManager extends ModerationServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "moderationAction";
    this.modelName = "ModerationAction";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = ModerationActionManager;
