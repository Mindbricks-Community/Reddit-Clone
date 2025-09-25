const { DeleteAbuseReportManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class DeleteAbuseReportRestController extends AbuseRestController {
  constructor(req, res) {
    super("deleteAbuseReport", "deleteabusereport", req, res);
    this.dataName = "abuseReport";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteAbuseReportManager(this._req, "rest");
  }
}

const deleteAbuseReport = async (req, res, next) => {
  const deleteAbuseReportRestController = new DeleteAbuseReportRestController(
    req,
    res,
  );
  try {
    await deleteAbuseReportRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteAbuseReport;
