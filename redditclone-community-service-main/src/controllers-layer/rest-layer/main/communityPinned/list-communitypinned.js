const { ListCommunityPinnedManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class ListCommunityPinnedRestController extends CommunityRestController {
  constructor(req, res) {
    super("listCommunityPinned", "listcommunitypinned", req, res);
    this.dataName = "communityPinneds";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListCommunityPinnedManager(this._req, "rest");
  }
}

const listCommunityPinned = async (req, res, next) => {
  const listCommunityPinnedRestController =
    new ListCommunityPinnedRestController(req, res);
  try {
    await listCommunityPinnedRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listCommunityPinned;
