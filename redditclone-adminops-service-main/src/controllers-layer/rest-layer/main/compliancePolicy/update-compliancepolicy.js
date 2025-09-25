const { UpdateCompliancePolicyManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class UpdateCompliancePolicyRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("updateCompliancePolicy", "updatecompliancepolicy", req, res);
    this.dataName = "compliancePolicy";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateCompliancePolicyManager(this._req, "rest");
  }
}

const updateCompliancePolicy = async (req, res, next) => {
  const updateCompliancePolicyRestController =
    new UpdateCompliancePolicyRestController(req, res);
  try {
    await updateCompliancePolicyRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateCompliancePolicy;
