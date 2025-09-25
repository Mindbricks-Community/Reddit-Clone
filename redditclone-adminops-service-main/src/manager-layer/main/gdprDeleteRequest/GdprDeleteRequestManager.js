const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const AdminOpsServiceManager = require("../../service-manager/AdminOpsServiceManager");

/* Base Class For the Crud Routes Of DbObject GdprDeleteRequest */
class GdprDeleteRequestManager extends AdminOpsServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "gdprDeleteRequest";
    this.modelName = "GdprDeleteRequest";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = GdprDeleteRequestManager;
