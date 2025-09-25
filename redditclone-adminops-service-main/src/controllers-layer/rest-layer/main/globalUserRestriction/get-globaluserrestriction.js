const { GetGlobalUserRestrictionManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class GetGlobalUserRestrictionRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("getGlobalUserRestriction", "getglobaluserrestriction", req, res);
    this.dataName = "globalUserRestriction";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetGlobalUserRestrictionManager(this._req, "rest");
  }
}

const getGlobalUserRestriction = async (req, res, next) => {
  const getGlobalUserRestrictionRestController =
    new GetGlobalUserRestrictionRestController(req, res);
  try {
    await getGlobalUserRestrictionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getGlobalUserRestriction;
