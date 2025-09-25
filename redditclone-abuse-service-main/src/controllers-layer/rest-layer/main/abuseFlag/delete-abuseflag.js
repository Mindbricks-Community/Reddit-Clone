const { DeleteAbuseFlagManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class DeleteAbuseFlagRestController extends AbuseRestController {
  constructor(req, res) {
    super("deleteAbuseFlag", "deleteabuseflag", req, res);
    this.dataName = "abuseFlag";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteAbuseFlagManager(this._req, "rest");
  }
}

const deleteAbuseFlag = async (req, res, next) => {
  const deleteAbuseFlagRestController = new DeleteAbuseFlagRestController(
    req,
    res,
  );
  try {
    await deleteAbuseFlagRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteAbuseFlag;
