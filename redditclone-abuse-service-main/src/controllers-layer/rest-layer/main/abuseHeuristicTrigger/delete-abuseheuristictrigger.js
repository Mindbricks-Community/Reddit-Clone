const { DeleteAbuseHeuristicTriggerManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class DeleteAbuseHeuristicTriggerRestController extends AbuseRestController {
  constructor(req, res) {
    super(
      "deleteAbuseHeuristicTrigger",
      "deleteabuseheuristictrigger",
      req,
      res,
    );
    this.dataName = "abuseHeuristicTrigger";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteAbuseHeuristicTriggerManager(this._req, "rest");
  }
}

const deleteAbuseHeuristicTrigger = async (req, res, next) => {
  const deleteAbuseHeuristicTriggerRestController =
    new DeleteAbuseHeuristicTriggerRestController(req, res);
  try {
    await deleteAbuseHeuristicTriggerRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteAbuseHeuristicTrigger;
