const { ListGlobalUserRestrictionsManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class ListGlobalUserRestrictionsRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("listGlobalUserRestrictions", "listglobaluserrestrictions", req, res);
    this.dataName = "globalUserRestrictions";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListGlobalUserRestrictionsManager(this._req, "rest");
  }
}

const listGlobalUserRestrictions = async (req, res, next) => {
  const listGlobalUserRestrictionsRestController =
    new ListGlobalUserRestrictionsRestController(req, res);
  try {
    await listGlobalUserRestrictionsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listGlobalUserRestrictions;
