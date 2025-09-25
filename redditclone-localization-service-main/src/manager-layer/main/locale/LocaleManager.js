const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const LocalizationServiceManager = require("../../service-manager/LocalizationServiceManager");

/* Base Class For the Crud Routes Of DbObject Locale */
class LocaleManager extends LocalizationServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "locale";
    this.modelName = "Locale";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = LocaleManager;
