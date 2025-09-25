const { DeleteLocalizationStringManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class DeleteLocalizationStringRestController extends LocalizationRestController {
  constructor(req, res) {
    super("deleteLocalizationString", "deletelocalizationstring", req, res);
    this.dataName = "localizationString";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteLocalizationStringManager(this._req, "rest");
  }
}

const deleteLocalizationString = async (req, res, next) => {
  const deleteLocalizationStringRestController =
    new DeleteLocalizationStringRestController(req, res);
  try {
    await deleteLocalizationStringRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteLocalizationString;
