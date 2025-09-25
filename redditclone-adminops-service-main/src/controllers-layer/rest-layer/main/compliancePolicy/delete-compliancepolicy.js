const { DeleteCompliancePolicyManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class DeleteCompliancePolicyRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("deleteCompliancePolicy", "deletecompliancepolicy", req, res);
    this.dataName = "compliancePolicy";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteCompliancePolicyManager(this._req, "rest");
  }
}

const deleteCompliancePolicy = async (req, res, next) => {
  const deleteCompliancePolicyRestController =
    new DeleteCompliancePolicyRestController(req, res);
  try {
    await deleteCompliancePolicyRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteCompliancePolicy;
