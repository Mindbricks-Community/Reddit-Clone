const { UpdateAbuseHeuristicTriggerManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class UpdateAbuseHeuristicTriggerRestController extends AbuseRestController {
  constructor(req, res) {
    super(
      "updateAbuseHeuristicTrigger",
      "updateabuseheuristictrigger",
      req,
      res,
    );
    this.dataName = "abuseHeuristicTrigger";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateAbuseHeuristicTriggerManager(this._req, "rest");
  }
}

const updateAbuseHeuristicTrigger = async (req, res, next) => {
  const updateAbuseHeuristicTriggerRestController =
    new UpdateAbuseHeuristicTriggerRestController(req, res);
  try {
    await updateAbuseHeuristicTriggerRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateAbuseHeuristicTrigger;
