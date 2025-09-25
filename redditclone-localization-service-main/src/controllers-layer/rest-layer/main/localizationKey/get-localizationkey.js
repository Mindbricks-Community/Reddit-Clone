const { GetLocalizationKeyManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class GetLocalizationKeyRestController extends LocalizationRestController {
  constructor(req, res) {
    super("getLocalizationKey", "getlocalizationkey", req, res);
    this.dataName = "localizationKey";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetLocalizationKeyManager(this._req, "rest");
  }
}

const getLocalizationKey = async (req, res, next) => {
  const getLocalizationKeyRestController = new GetLocalizationKeyRestController(
    req,
    res,
  );
  try {
    await getLocalizationKeyRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getLocalizationKey;
