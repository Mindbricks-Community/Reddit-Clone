const { DeleteAbuseInvestigationManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class DeleteAbuseInvestigationRestController extends AbuseRestController {
  constructor(req, res) {
    super("deleteAbuseInvestigation", "deleteabuseinvestigation", req, res);
    this.dataName = "abuseInvestigation";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteAbuseInvestigationManager(this._req, "rest");
  }
}

const deleteAbuseInvestigation = async (req, res, next) => {
  const deleteAbuseInvestigationRestController =
    new DeleteAbuseInvestigationRestController(req, res);
  try {
    await deleteAbuseInvestigationRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteAbuseInvestigation;
