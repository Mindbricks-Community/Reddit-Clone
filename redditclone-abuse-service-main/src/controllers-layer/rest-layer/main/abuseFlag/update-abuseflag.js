const { UpdateAbuseFlagManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class UpdateAbuseFlagRestController extends AbuseRestController {
  constructor(req, res) {
    super("updateAbuseFlag", "updateabuseflag", req, res);
    this.dataName = "abuseFlag";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateAbuseFlagManager(this._req, "rest");
  }
}

const updateAbuseFlag = async (req, res, next) => {
  const updateAbuseFlagRestController = new UpdateAbuseFlagRestController(
    req,
    res,
  );
  try {
    await updateAbuseFlagRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateAbuseFlag;
