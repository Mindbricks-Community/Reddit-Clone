const { ListMediaScansManager } = require("managers");

const MediaRestController = require("../../MediaServiceRestController");

class ListMediaScansRestController extends MediaRestController {
  constructor(req, res) {
    super("listMediaScans", "listmediascans", req, res);
    this.dataName = "mediaScans";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListMediaScansManager(this._req, "rest");
  }
}

const listMediaScans = async (req, res, next) => {
  const listMediaScansRestController = new ListMediaScansRestController(
    req,
    res,
  );
  try {
    await listMediaScansRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listMediaScans;
