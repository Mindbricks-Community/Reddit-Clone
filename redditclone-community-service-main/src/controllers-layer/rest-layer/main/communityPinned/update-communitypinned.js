const { UpdateCommunityPinnedManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class UpdateCommunityPinnedRestController extends CommunityRestController {
  constructor(req, res) {
    super("updateCommunityPinned", "updatecommunitypinned", req, res);
    this.dataName = "communityPinned";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateCommunityPinnedManager(this._req, "rest");
  }
}

const updateCommunityPinned = async (req, res, next) => {
  const updateCommunityPinnedRestController =
    new UpdateCommunityPinnedRestController(req, res);
  try {
    await updateCommunityPinnedRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateCommunityPinned;
