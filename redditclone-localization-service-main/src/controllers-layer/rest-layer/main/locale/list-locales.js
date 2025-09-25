const { ListLocalesManager } = require("managers");

const LocalizationRestController = require("../../LocalizationServiceRestController");

class ListLocalesRestController extends LocalizationRestController {
  constructor(req, res) {
    super("listLocales", "listlocales", req, res);
    this.dataName = "locales";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListLocalesManager(this._req, "rest");
  }
}

const listLocales = async (req, res, next) => {
  const listLocalesRestController = new ListLocalesRestController(req, res);
  try {
    await listLocalesRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listLocales;
