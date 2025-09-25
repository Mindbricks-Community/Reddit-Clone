const { UpdateCommunityRuleManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class UpdateCommunityRuleRestController extends CommunityRestController {
  constructor(req, res) {
    super("updateCommunityRule", "updatecommunityrule", req, res);
    this.dataName = "communityRule";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateCommunityRuleManager(this._req, "rest");
  }
}

const updateCommunityRule = async (req, res, next) => {
  const updateCommunityRuleRestController =
    new UpdateCommunityRuleRestController(req, res);
  try {
    await updateCommunityRuleRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateCommunityRule;
