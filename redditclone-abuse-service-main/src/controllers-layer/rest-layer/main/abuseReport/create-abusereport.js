const { CreateAbuseReportManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class CreateAbuseReportRestController extends AbuseRestController {
  constructor(req, res) {
    super("createAbuseReport", "createabusereport", req, res);
    this.dataName = "abuseReport";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateAbuseReportManager(this._req, "rest");
  }
}

const createAbuseReport = async (req, res, next) => {
  const createAbuseReportRestController = new CreateAbuseReportRestController(
    req,
    res,
  );
  try {
    await createAbuseReportRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createAbuseReport;
