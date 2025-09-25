const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const AbuseServiceManager = require("../../service-manager/AbuseServiceManager");

/* Base Class For the Crud Routes Of DbObject AbuseHeuristicTrigger */
class AbuseHeuristicTriggerManager extends AbuseServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "abuseHeuristicTrigger";
    this.modelName = "AbuseHeuristicTrigger";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = AbuseHeuristicTriggerManager;
