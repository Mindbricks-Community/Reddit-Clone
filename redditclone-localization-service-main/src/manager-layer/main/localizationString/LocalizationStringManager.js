const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const LocalizationServiceManager = require("../../service-manager/LocalizationServiceManager");

/* Base Class For the Crud Routes Of DbObject LocalizationString */
class LocalizationStringManager extends LocalizationServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "localizationString";
    this.modelName = "LocalizationString";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = LocalizationStringManager;
