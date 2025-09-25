const { CreateAbuseFlagManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class CreateAbuseFlagRestController extends AbuseRestController {
  constructor(req, res) {
    super("createAbuseFlag", "createabuseflag", req, res);
    this.dataName = "abuseFlag";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateAbuseFlagManager(this._req, "rest");
  }
}

const createAbuseFlag = async (req, res, next) => {
  const createAbuseFlagRestController = new CreateAbuseFlagRestController(
    req,
    res,
  );
  try {
    await createAbuseFlagRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createAbuseFlag;
