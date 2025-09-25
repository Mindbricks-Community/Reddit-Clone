const { HttpServerError, HttpError, PaymentGateError } = require("common");
const { hexaLogger } = require("common");
const { ElasticIndexer } = require("serviceCommon");

const AdminOpsServiceManager = require("../../service-manager/AdminOpsServiceManager");

/* Base Class For the Crud Routes Of DbObject CompliancePolicy */
class CompliancePolicyManager extends AdminOpsServiceManager {
  constructor(request, options) {
    super(request, options);
    this.objectName = "compliancePolicy";
    this.modelName = "CompliancePolicy";
  }

  toJSON() {
    const jsonObj = super.toJSON();

    return jsonObj;
  }
}

module.exports = CompliancePolicyManager;
