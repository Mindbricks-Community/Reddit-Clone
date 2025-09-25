const { UpdateLocaleManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class UpdateLocaleRestController extends LocalizationRestController {
  constructor(req, res) {
    super("updateLocale", "updatelocale", req, res);
    this.dataName = "locale";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateLocaleManager(this._req, "rest");
  }
}

const updateLocale = async (req, res, next) => {
  const updateLocaleRestController = new UpdateLocaleRestController(req, res);
  try {
    await updateLocaleRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateLocale;
