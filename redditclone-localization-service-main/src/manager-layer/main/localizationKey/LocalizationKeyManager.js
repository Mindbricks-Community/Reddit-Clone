const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const LocalizationServiceManager = require("../../service-manager/LocalizationServiceManager");

/* Base Class For the Crud Routes Of DbObject LocalizationKey */
class LocalizationKeyManager extends LocalizationServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "localizationKey";
    this.modelName = "LocalizationKey";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = LocalizationKeyManager;
