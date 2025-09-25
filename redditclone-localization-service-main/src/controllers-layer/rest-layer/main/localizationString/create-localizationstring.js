const { CreateLocalizationStringManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class CreateLocalizationStringRestController extends LocalizationRestController {
  constructor(req, res) {
    super("createLocalizationString", "createlocalizationstring", req, res);
    this.dataName = "localizationString";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateLocalizationStringManager(this._req, "rest");
  }
}

const createLocalizationString = async (req, res, next) => {
  const createLocalizationStringRestController =
    new CreateLocalizationStringRestController(req, res);
  try {
    await createLocalizationStringRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createLocalizationString;
