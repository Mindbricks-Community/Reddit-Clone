const { CreateAdminUserActionManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class CreateAdminUserActionRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("createAdminUserAction", "createadminuseraction", req, res);
    this.dataName = "adminUserAction";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateAdminUserActionManager(this._req, "rest");
  }
}

const createAdminUserAction = async (req, res, next) => {
  const createAdminUserActionRestController =
    new CreateAdminUserActionRestController(req, res);
  try {
    await createAdminUserActionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createAdminUserAction;
