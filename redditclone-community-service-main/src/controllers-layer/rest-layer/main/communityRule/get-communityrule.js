const { GetCommunityRuleManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class GetCommunityRuleRestController extends CommunityRestController {
  constructor(req, res) {
    super("getCommunityRule", "getcommunityrule", req, res);
    this.dataName = "communityRule";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetCommunityRuleManager(this._req, "rest");
  }
}

const getCommunityRule = async (req, res, next) => {
  const getCommunityRuleRestController = new GetCommunityRuleRestController(
    req,
    res,
  );
  try {
    await getCommunityRuleRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getCommunityRule;
