const { UpdateLocalizationKeyManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class UpdateLocalizationKeyRestController extends LocalizationRestController {
  constructor(req, res) {
    super("updateLocalizationKey", "updatelocalizationkey", req, res);
    this.dataName = "localizationKey";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateLocalizationKeyManager(this._req, "rest");
  }
}

const updateLocalizationKey = async (req, res, next) => {
  const updateLocalizationKeyRestController =
    new UpdateLocalizationKeyRestController(req, res);
  try {
    await updateLocalizationKeyRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateLocalizationKey;
