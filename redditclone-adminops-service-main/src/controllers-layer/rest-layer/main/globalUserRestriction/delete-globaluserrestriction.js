const { DeleteGlobalUserRestrictionManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class DeleteGlobalUserRestrictionRestController extends AdminOpsRestController {
  constructor(req, res) {
    super(
      "deleteGlobalUserRestriction",
      "deleteglobaluserrestriction",
      req,
      res,
    );
    this.dataName = "globalUserRestriction";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteGlobalUserRestrictionManager(this._req, "rest");
  }
}

const deleteGlobalUserRestriction = async (req, res, next) => {
  const deleteGlobalUserRestrictionRestController =
    new DeleteGlobalUserRestrictionRestController(req, res);
  try {
    await deleteGlobalUserRestrictionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteGlobalUserRestriction;
