const { ListAbuseFlagsManager } = require("managers");

const AbuseRestController = require("../../AbuseServiceRestController");

class ListAbuseFlagsRestController extends AbuseRestController {
  constructor(req, res) {
    super("listAbuseFlags", "listabuseflags", req, res);
    this.dataName = "abuseFlags";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListAbuseFlagsManager(this._req, "rest");
  }
}

const listAbuseFlags = async (req, res, next) => {
  const listAbuseFlagsRestController = new ListAbuseFlagsRestController(
    req,
    res,
  );
  try {
    await listAbuseFlagsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listAbuseFlags;
