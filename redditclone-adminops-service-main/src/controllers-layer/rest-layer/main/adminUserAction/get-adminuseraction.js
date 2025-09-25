const { GetAdminUserActionManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class GetAdminUserActionRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("getAdminUserAction", "getadminuseraction", req, res);
    this.dataName = "adminUserAction";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetAdminUserActionManager(this._req, "rest");
  }
}

const getAdminUserAction = async (req, res, next) => {
  const getAdminUserActionRestController = new GetAdminUserActionRestController(
    req,
    res,
  );
  try {
    await getAdminUserActionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getAdminUserAction;
