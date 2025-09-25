const { GetAbuseInvestigationManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class GetAbuseInvestigationRestController extends AbuseRestController {
  constructor(req, res) {
    super("getAbuseInvestigation", "getabuseinvestigation", req, res);
    this.dataName = "abuseInvestigation";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetAbuseInvestigationManager(this._req, "rest");
  }
}

const getAbuseInvestigation = async (req, res, next) => {
  const getAbuseInvestigationRestController =
    new GetAbuseInvestigationRestController(req, res);
  try {
    await getAbuseInvestigationRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getAbuseInvestigation;
