const { GetAbuseReportManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class GetAbuseReportRestController extends AbuseRestController {
  constructor(req, res) {
    super("getAbuseReport", "getabusereport", req, res);
    this.dataName = "abuseReport";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetAbuseReportManager(this._req, "rest");
  }
}

const getAbuseReport = async (req, res, next) => {
  const getAbuseReportRestController = new GetAbuseReportRestController(
    req,
    res,
  );
  try {
    await getAbuseReportRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getAbuseReport;
