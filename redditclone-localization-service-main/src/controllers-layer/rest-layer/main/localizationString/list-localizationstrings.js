const { ListLocalizationStringsManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class ListLocalizationStringsRestController extends LocalizationRestController {
  constructor(req, res) {
    super("listLocalizationStrings", "listlocalizationstrings", req, res);
    this.dataName = "localizationStrings";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListLocalizationStringsManager(this._req, "rest");
  }
}

const listLocalizationStrings = async (req, res, next) => {
  const listLocalizationStringsRestController =
    new ListLocalizationStringsRestController(req, res);
  try {
    await listLocalizationStringsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listLocalizationStrings;
