const { GetCommunityManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class GetCommunityRestController extends CommunityRestController {
  constructor(req, res) {
    super("getCommunity", "getcommunity", req, res);
    this.dataName = "community";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetCommunityManager(this._req, "rest");
  }
}

const getCommunity = async (req, res, next) => {
  const getCommunityRestController = new GetCommunityRestController(req, res);
  try {
    await getCommunityRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getCommunity;
