const { GetLocaleManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class GetLocaleRestController extends LocalizationRestController {
  constructor(req, res) {
    super("getLocale", "getlocale", req, res);
    this.dataName = "locale";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetLocaleManager(this._req, "rest");
  }
}

const getLocale = async (req, res, next) => {
  const getLocaleRestController = new GetLocaleRestController(req, res);
  try {
    await getLocaleRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getLocale;
