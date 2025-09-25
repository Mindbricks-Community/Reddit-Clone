const { UpdateAdminUserActionManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class UpdateAdminUserActionRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("updateAdminUserAction", "updateadminuseraction", req, res);
    this.dataName = "adminUserAction";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateAdminUserActionManager(this._req, "rest");
  }
}

const updateAdminUserAction = async (req, res, next) => {
  const updateAdminUserActionRestController =
    new UpdateAdminUserActionRestController(req, res);
  try {
    await updateAdminUserActionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateAdminUserAction;
