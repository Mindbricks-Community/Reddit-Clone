const { ListAbuseHeuristicTriggersManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class ListAbuseHeuristicTriggersRestController extends AbuseRestController {
  constructor(req, res) {
    super("listAbuseHeuristicTriggers", "listabuseheuristictriggers", req, res);
    this.dataName = "abuseHeuristicTriggers";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListAbuseHeuristicTriggersManager(this._req, "rest");
  }
}

const listAbuseHeuristicTriggers = async (req, res, next) => {
  const listAbuseHeuristicTriggersRestController =
    new ListAbuseHeuristicTriggersRestController(req, res);
  try {
    await listAbuseHeuristicTriggersRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listAbuseHeuristicTriggers;
