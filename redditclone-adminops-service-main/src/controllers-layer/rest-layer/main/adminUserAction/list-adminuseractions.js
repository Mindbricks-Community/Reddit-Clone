const { ListAdminUserActionsManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class ListAdminUserActionsRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("listAdminUserActions", "listadminuseractions", req, res);
    this.dataName = "adminUserActions";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListAdminUserActionsManager(this._req, "rest");
  }
}

const listAdminUserActions = async (req, res, next) => {
  const listAdminUserActionsRestController =
    new ListAdminUserActionsRestController(req, res);
  try {
    await listAdminUserActionsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listAdminUserActions;
