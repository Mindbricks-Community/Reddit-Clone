const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const ContentServiceManager = require("../../service-manager/ContentServiceManager");

/* Base Class For the Crud Routes Of DbObject Vote */
class VoteManager extends ContentServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "vote";
    this.modelName = "Vote";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = VoteManager;
