const { DeleteAdminUserActionManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class DeleteAdminUserActionRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("deleteAdminUserAction", "deleteadminuseraction", req, res);
    this.dataName = "adminUserAction";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteAdminUserActionManager(this._req, "rest");
  }
}

const deleteAdminUserAction = async (req, res, next) => {
  const deleteAdminUserActionRestController =
    new DeleteAdminUserActionRestController(req, res);
  try {
    await deleteAdminUserActionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteAdminUserAction;
