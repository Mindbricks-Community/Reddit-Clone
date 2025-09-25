const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const ContentServiceManager = require("../../service-manager/ContentServiceManager");

/* Base Class For the Crud Routes Of DbObject PostMedia */
class PostMediaManager extends ContentServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "postMedia";
    this.modelName = "PostMedia";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = PostMediaManager;
