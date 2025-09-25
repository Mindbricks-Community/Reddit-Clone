const { GetLocalizationStringManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class GetLocalizationStringRestController extends LocalizationRestController {
  constructor(req, res) {
    super("getLocalizationString", "getlocalizationstring", req, res);
    this.dataName = "localizationString";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetLocalizationStringManager(this._req, "rest");
  }
}

const getLocalizationString = async (req, res, next) => {
  const getLocalizationStringRestController =
    new GetLocalizationStringRestController(req, res);
  try {
    await getLocalizationStringRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getLocalizationString;
