const { UpdateCommunityManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class UpdateCommunityRestController extends CommunityRestController {
  constructor(req, res) {
    super("updateCommunity", "updatecommunity", req, res);
    this.dataName = "community";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateCommunityManager(this._req, "rest");
  }
}

const updateCommunity = async (req, res, next) => {
  const updateCommunityRestController = new UpdateCommunityRestController(
    req,
    res,
  );
  try {
    await updateCommunityRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateCommunity;
