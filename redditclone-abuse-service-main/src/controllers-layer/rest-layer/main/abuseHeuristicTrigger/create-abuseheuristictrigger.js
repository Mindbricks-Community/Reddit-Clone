const { CreateAbuseHeuristicTriggerManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class CreateAbuseHeuristicTriggerRestController extends AbuseRestController {
  constructor(req, res) {
    super(
      "createAbuseHeuristicTrigger",
      "createabuseheuristictrigger",
      req,
      res,
    );
    this.dataName = "abuseHeuristicTrigger";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateAbuseHeuristicTriggerManager(this._req, "rest");
  }
}

const createAbuseHeuristicTrigger = async (req, res, next) => {
  const createAbuseHeuristicTriggerRestController =
    new CreateAbuseHeuristicTriggerRestController(req, res);
  try {
    await createAbuseHeuristicTriggerRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createAbuseHeuristicTrigger;
