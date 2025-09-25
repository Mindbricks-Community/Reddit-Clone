const { DeleteLocalizationKeyManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class DeleteLocalizationKeyRestController extends LocalizationRestController {
  constructor(req, res) {
    super("deleteLocalizationKey", "deletelocalizationkey", req, res);
    this.dataName = "localizationKey";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteLocalizationKeyManager(this._req, "rest");
  }
}

const deleteLocalizationKey = async (req, res, next) => {
  const deleteLocalizationKeyRestController =
    new DeleteLocalizationKeyRestController(req, res);
  try {
    await deleteLocalizationKeyRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteLocalizationKey;
