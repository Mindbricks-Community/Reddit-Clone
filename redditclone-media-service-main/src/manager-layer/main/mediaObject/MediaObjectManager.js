const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const MediaServiceManager = require("../../service-manager/MediaServiceManager");

/* Base Class For the Crud Routes Of DbObject MediaObject */
class MediaObjectManager extends MediaServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "mediaObject";
    this.modelName = "MediaObject";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = MediaObjectManager;
