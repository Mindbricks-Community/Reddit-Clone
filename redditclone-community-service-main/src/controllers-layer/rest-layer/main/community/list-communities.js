const { ListCommunitiesManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class ListCommunitiesRestController extends CommunityRestController {
  constructor(req, res) {
    super("listCommunities", "listcommunities", req, res);
    this.dataName = "communities";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListCommunitiesManager(this._req, "rest");
  }
}

const listCommunities = async (req, res, next) => {
  const listCommunitiesRestController = new ListCommunitiesRestController(
    req,
    res,
  );
  try {
    await listCommunitiesRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listCommunities;
