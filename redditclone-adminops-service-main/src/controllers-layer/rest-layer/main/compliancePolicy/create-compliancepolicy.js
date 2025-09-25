const { CreateCompliancePolicyManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class CreateCompliancePolicyRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("createCompliancePolicy", "createcompliancepolicy", req, res);
    this.dataName = "compliancePolicy";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateCompliancePolicyManager(this._req, "rest");
  }
}

const createCompliancePolicy = async (req, res, next) => {
  const createCompliancePolicyRestController =
    new CreateCompliancePolicyRestController(req, res);
  try {
    await createCompliancePolicyRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createCompliancePolicy;
