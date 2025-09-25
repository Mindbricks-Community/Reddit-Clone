const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const AbuseServiceManager = require("../../service-manager/AbuseServiceManager");

/* Base Class For the Crud Routes Of DbObject AbuseFlag */
class AbuseFlagManager extends AbuseServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "abuseFlag";
    this.modelName = "AbuseFlag";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = AbuseFlagManager;
