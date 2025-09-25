const { CreateLocalizationKeyManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class CreateLocalizationKeyRestController extends LocalizationRestController {
  constructor(req, res) {
    super("createLocalizationKey", "createlocalizationkey", req, res);
    this.dataName = "localizationKey";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateLocalizationKeyManager(this._req, "rest");
  }
}

const createLocalizationKey = async (req, res, next) => {
  const createLocalizationKeyRestController =
    new CreateLocalizationKeyRestController(req, res);
  try {
    await createLocalizationKeyRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createLocalizationKey;
