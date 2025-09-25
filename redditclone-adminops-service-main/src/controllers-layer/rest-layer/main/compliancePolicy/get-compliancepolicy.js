const { GetCompliancePolicyManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class GetCompliancePolicyRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("getCompliancePolicy", "getcompliancepolicy", req, res);
    this.dataName = "compliancePolicy";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetCompliancePolicyManager(this._req, "rest");
  }
}

const getCompliancePolicy = async (req, res, next) => {
  const getCompliancePolicyRestController =
    new GetCompliancePolicyRestController(req, res);
  try {
    await getCompliancePolicyRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getCompliancePolicy;
