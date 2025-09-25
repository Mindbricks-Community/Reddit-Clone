const { CreateAbuseInvestigationManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class CreateAbuseInvestigationRestController extends AbuseRestController {
  constructor(req, res) {
    super("createAbuseInvestigation", "createabuseinvestigation", req, res);
    this.dataName = "abuseInvestigation";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateAbuseInvestigationManager(this._req, "rest");
  }
}

const createAbuseInvestigation = async (req, res, next) => {
  const createAbuseInvestigationRestController =
    new CreateAbuseInvestigationRestController(req, res);
  try {
    await createAbuseInvestigationRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createAbuseInvestigation;
