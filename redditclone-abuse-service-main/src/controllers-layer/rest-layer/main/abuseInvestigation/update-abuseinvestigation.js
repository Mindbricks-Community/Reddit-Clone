const { UpdateAbuseInvestigationManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class UpdateAbuseInvestigationRestController extends AbuseRestController {
  constructor(req, res) {
    super("updateAbuseInvestigation", "updateabuseinvestigation", req, res);
    this.dataName = "abuseInvestigation";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateAbuseInvestigationManager(this._req, "rest");
  }
}

const updateAbuseInvestigation = async (req, res, next) => {
  const updateAbuseInvestigationRestController =
    new UpdateAbuseInvestigationRestController(req, res);
  try {
    await updateAbuseInvestigationRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateAbuseInvestigation;
