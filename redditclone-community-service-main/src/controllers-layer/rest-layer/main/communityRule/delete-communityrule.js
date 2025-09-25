const { DeleteCommunityRuleManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class DeleteCommunityRuleRestController extends CommunityRestController {
  constructor(req, res) {
    super("deleteCommunityRule", "deletecommunityrule", req, res);
    this.dataName = "communityRule";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteCommunityRuleManager(this._req, "rest");
  }
}

const deleteCommunityRule = async (req, res, next) => {
  const deleteCommunityRuleRestController =
    new DeleteCommunityRuleRestController(req, res);
  try {
    await deleteCommunityRuleRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteCommunityRule;
