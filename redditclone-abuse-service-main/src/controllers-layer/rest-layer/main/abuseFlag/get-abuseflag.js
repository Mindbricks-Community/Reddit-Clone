const { GetAbuseFlagManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class GetAbuseFlagRestController extends AbuseRestController {
  constructor(req, res) {
    super("getAbuseFlag", "getabuseflag", req, res);
    this.dataName = "abuseFlag";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetAbuseFlagManager(this._req, "rest");
  }
}

const getAbuseFlag = async (req, res, next) => {
  const getAbuseFlagRestController = new GetAbuseFlagRestController(req, res);
  try {
    await getAbuseFlagRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getAbuseFlag;
