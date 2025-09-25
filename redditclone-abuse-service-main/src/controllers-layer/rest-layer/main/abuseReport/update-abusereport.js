const { UpdateAbuseReportManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class UpdateAbuseReportRestController extends AbuseRestController {
  constructor(req, res) {
    super("updateAbuseReport", "updateabusereport", req, res);
    this.dataName = "abuseReport";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateAbuseReportManager(this._req, "rest");
  }
}

const updateAbuseReport = async (req, res, next) => {
  const updateAbuseReportRestController = new UpdateAbuseReportRestController(
    req,
    res,
  );
  try {
    await updateAbuseReportRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateAbuseReport;
