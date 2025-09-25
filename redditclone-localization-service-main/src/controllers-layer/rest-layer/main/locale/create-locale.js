const { CreateLocaleManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class CreateLocaleRestController extends LocalizationRestController {
  constructor(req, res) {
    super("createLocale", "createlocale", req, res);
    this.dataName = "locale";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateLocaleManager(this._req, "rest");
  }
}

const createLocale = async (req, res, next) => {
  const createLocaleRestController = new CreateLocaleRestController(req, res);
  try {
    await createLocaleRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createLocale;
