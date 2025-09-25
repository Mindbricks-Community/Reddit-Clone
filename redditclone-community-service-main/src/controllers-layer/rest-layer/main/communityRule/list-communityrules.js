const { ListCommunityRulesManager } = require("managers");

const CommunityRestController = require("../../CommunityServiceRestController");

class ListCommunityRulesRestController extends CommunityRestController {
  constructor(req, res) {
    super("listCommunityRules", "listcommunityrules", req, res);
    this.dataName = "communityRules";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListCommunityRulesManager(this._req, "rest");
  }
}

const listCommunityRules = async (req, res, next) => {
  const listCommunityRulesRestController = new ListCommunityRulesRestController(
    req,
    res,
  );
  try {
    await listCommunityRulesRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listCommunityRules;
