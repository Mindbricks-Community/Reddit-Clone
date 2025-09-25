const { ListAbuseReportsManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class ListAbuseReportsRestController extends AbuseRestController {
  constructor(req, res) {
    super("listAbuseReports", "listabusereports", req, res);
    this.dataName = "abuseReports";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListAbuseReportsManager(this._req, "rest");
  }
}

const listAbuseReports = async (req, res, next) => {
  const listAbuseReportsRestController = new ListAbuseReportsRestController(
    req,
    res,
  );
  try {
    await listAbuseReportsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listAbuseReports;
