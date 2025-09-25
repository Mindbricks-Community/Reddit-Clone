const { DeleteCommunityManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class DeleteCommunityRestController extends CommunityRestController {
  constructor(req, res) {
    super("deleteCommunity", "deletecommunity", req, res);
    this.dataName = "community";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteCommunityManager(this._req, "rest");
  }
}

const deleteCommunity = async (req, res, next) => {
  const deleteCommunityRestController = new DeleteCommunityRestController(
    req,
    res,
  );
  try {
    await deleteCommunityRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteCommunity;
