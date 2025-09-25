const { UpdateLocalizationStringManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class UpdateLocalizationStringRestController extends LocalizationRestController {
  constructor(req, res) {
    super("updateLocalizationString", "updatelocalizationstring", req, res);
    this.dataName = "localizationString";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateLocalizationStringManager(this._req, "rest");
  }
}

const updateLocalizationString = async (req, res, next) => {
  const updateLocalizationStringRestController =
    new UpdateLocalizationStringRestController(req, res);
  try {
    await updateLocalizationStringRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateLocalizationString;
