const { DeleteCommunityPinnedManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class DeleteCommunityPinnedRestController extends CommunityRestController {
  constructor(req, res) {
    super("deleteCommunityPinned", "deletecommunitypinned", req, res);
    this.dataName = "communityPinned";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteCommunityPinnedManager(this._req, "rest");
  }
}

const deleteCommunityPinned = async (req, res, next) => {
  const deleteCommunityPinnedRestController =
    new DeleteCommunityPinnedRestController(req, res);
  try {
    await deleteCommunityPinnedRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteCommunityPinned;
