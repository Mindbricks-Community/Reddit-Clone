const { DeleteLocaleManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class DeleteLocaleRestController extends LocalizationRestController {
  constructor(req, res) {
    super("deleteLocale", "deletelocale", req, res);
    this.dataName = "locale";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteLocaleManager(this._req, "rest");
  }
}

const deleteLocale = async (req, res, next) => {
  const deleteLocaleRestController = new DeleteLocaleRestController(req, res);
  try {
    await deleteLocaleRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteLocale;
