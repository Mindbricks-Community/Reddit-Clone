const { CreateGlobalUserRestrictionManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class CreateGlobalUserRestrictionRestController extends AdminOpsRestController {
  constructor(req, res) {
    super(
      "createGlobalUserRestriction",
      "createglobaluserrestriction",
      req,
      res,
    );
    this.dataName = "globalUserRestriction";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateGlobalUserRestrictionManager(this._req, "rest");
  }
}

const createGlobalUserRestriction = async (req, res, next) => {
  const createGlobalUserRestrictionRestController =
    new CreateGlobalUserRestrictionRestController(req, res);
  try {
    await createGlobalUserRestrictionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createGlobalUserRestriction;
