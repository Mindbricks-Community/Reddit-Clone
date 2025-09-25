const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const AdminOpsServiceManager = require("../../service-manager/AdminOpsServiceManager");

/* Base Class For the Crud Routes Of DbObject GdprExportRequest */
class GdprExportRequestManager extends AdminOpsServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "gdprExportRequest";
    this.modelName = "GdprExportRequest";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = GdprExportRequestManager;
