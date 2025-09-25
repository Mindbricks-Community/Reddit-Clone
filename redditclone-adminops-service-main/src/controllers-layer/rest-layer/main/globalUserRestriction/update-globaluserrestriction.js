const { UpdateGlobalUserRestrictionManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class UpdateGlobalUserRestrictionRestController extends AdminOpsRestController {
  constructor(req, res) {
    super(
      "updateGlobalUserRestriction",
      "updateglobaluserrestriction",
      req,
      res,
    );
    this.dataName = "globalUserRestriction";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateGlobalUserRestrictionManager(this._req, "rest");
  }
}

const updateGlobalUserRestriction = async (req, res, next) => {
  const updateGlobalUserRestrictionRestController =
    new UpdateGlobalUserRestrictionRestController(req, res);
  try {
    await updateGlobalUserRestrictionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateGlobalUserRestriction;
