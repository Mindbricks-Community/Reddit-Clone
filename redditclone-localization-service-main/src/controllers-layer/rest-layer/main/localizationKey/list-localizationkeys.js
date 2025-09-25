const { ListLocalizationKeysManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class ListLocalizationKeysRestController extends LocalizationRestController {
  constructor(req, res) {
    super("listLocalizationKeys", "listlocalizationkeys", req, res);
    this.dataName = "localizationKeys";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListLocalizationKeysManager(this._req, "rest");
  }
}

const listLocalizationKeys = async (req, res, next) => {
  const listLocalizationKeysRestController =
    new ListLocalizationKeysRestController(req, res);
  try {
    await listLocalizationKeysRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listLocalizationKeys;
