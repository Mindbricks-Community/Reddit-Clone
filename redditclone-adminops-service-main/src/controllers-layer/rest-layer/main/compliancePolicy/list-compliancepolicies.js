const { ListCompliancePoliciesManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class ListCompliancePoliciesRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("listCompliancePolicies", "listcompliancepolicies", req, res);
    this.dataName = "compliancePolicies";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListCompliancePoliciesManager(this._req, "rest");
  }
}

const listCompliancePolicies = async (req, res, next) => {
  const listCompliancePoliciesRestController =
    new ListCompliancePoliciesRestController(req, res);
  try {
    await listCompliancePoliciesRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listCompliancePolicies;
