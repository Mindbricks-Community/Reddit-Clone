const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const MediaServiceManager = require("../../service-manager/MediaServiceManager");

/* Base Class For the Crud Routes Of DbObject MediaScan */
class MediaScanManager extends MediaServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "mediaScan";
    this.modelName = "MediaScan";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = MediaScanManager;
