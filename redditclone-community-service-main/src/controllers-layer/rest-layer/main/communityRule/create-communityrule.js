const { CreateCommunityRuleManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class CreateCommunityRuleRestController extends CommunityRestController {
  constructor(req, res) {
    super("createCommunityRule", "createcommunityrule", req, res);
    this.dataName = "communityRule";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateCommunityRuleManager(this._req, "rest");
  }
}

const createCommunityRule = async (req, res, next) => {
  const createCommunityRuleRestController =
    new CreateCommunityRuleRestController(req, res);
  try {
    await createCommunityRuleRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createCommunityRule;
