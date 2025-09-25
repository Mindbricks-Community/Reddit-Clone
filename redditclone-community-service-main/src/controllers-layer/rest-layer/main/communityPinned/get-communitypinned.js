const { GetCommunityPinnedManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class GetCommunityPinnedRestController extends CommunityRestController {
  constructor(req, res) {
    super("getCommunityPinned", "getcommunitypinned", req, res);
    this.dataName = "communityPinned";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetCommunityPinnedManager(this._req, "rest");
  }
}

const getCommunityPinned = async (req, res, next) => {
  const getCommunityPinnedRestController = new GetCommunityPinnedRestController(
    req,
    res,
  );
  try {
    await getCommunityPinnedRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getCommunityPinned;
