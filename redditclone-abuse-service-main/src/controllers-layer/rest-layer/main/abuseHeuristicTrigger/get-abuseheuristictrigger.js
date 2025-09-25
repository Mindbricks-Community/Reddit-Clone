const { GetAbuseHeuristicTriggerManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class GetAbuseHeuristicTriggerRestController extends AbuseRestController {
  constructor(req, res) {
    super("getAbuseHeuristicTrigger", "getabuseheuristictrigger", req, res);
    this.dataName = "abuseHeuristicTrigger";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetAbuseHeuristicTriggerManager(this._req, "rest");
  }
}

const getAbuseHeuristicTrigger = async (req, res, next) => {
  const getAbuseHeuristicTriggerRestController =
    new GetAbuseHeuristicTriggerRestController(req, res);
  try {
    await getAbuseHeuristicTriggerRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getAbuseHeuristicTrigger;
