const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const AbuseServiceManager = require("../../service-manager/AbuseServiceManager");

/* Base Class For the Crud Routes Of DbObject AbuseInvestigation */
class AbuseInvestigationManager extends AbuseServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "abuseInvestigation";
    this.modelName = "AbuseInvestigation";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = AbuseInvestigationManager;
