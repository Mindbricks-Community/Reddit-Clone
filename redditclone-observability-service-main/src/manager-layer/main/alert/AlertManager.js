const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const ObservabilityServiceManager = require("../../service-manager/ObservabilityServiceManager");

/* Base Class For the Crud Routes Of DbObject Alert */
class AlertManager extends ObservabilityServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "alert";
    this.modelName = "Alert";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = AlertManager;
