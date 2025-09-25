const { ListAbuseInvestigationsManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class ListAbuseInvestigationsRestController extends AbuseRestController {
  constructor(req, res) {
    super("listAbuseInvestigations", "listabuseinvestigations", req, res);
    this.dataName = "abuseInvestigations";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListAbuseInvestigationsManager(this._req, "rest");
  }
}

const listAbuseInvestigations = async (req, res, next) => {
  const listAbuseInvestigationsRestController =
    new ListAbuseInvestigationsRestController(req, res);
  try {
    await listAbuseInvestigationsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listAbuseInvestigations;
