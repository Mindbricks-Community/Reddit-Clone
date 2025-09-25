const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const AdminOpsServiceManager = require("../../service-manager/AdminOpsServiceManager");

/* Base Class For the Crud Routes Of DbObject GlobalUserRestriction */
class GlobalUserRestrictionManager extends AdminOpsServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "globalUserRestriction";
    this.modelName = "GlobalUserRestriction";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = GlobalUserRestrictionManager;
