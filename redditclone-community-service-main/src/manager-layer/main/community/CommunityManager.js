const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const CommunityServiceManager = require("../../service-manager/CommunityServiceManager");

/* Base Class For the Crud Routes Of DbObject Community */
class CommunityManager extends CommunityServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "community";
    this.modelName = "Community";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = CommunityManager;
