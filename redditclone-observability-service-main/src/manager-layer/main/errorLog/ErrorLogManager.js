const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const ObservabilityServiceManager = require("../../service-manager/ObservabilityServiceManager");

/* Base Class For the Crud Routes Of DbObject ErrorLog */
class ErrorLogManager extends ObservabilityServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "errorLog";
    this.modelName = "ErrorLog";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = ErrorLogManager;
