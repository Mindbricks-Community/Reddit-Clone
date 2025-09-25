const { ListMediaObjectsManager } = require("managers");

const MediaRestController = require("../../MediaServiceRestController");

class ListMediaObjectsRestController extends MediaRestController {
  constructor(req, res) {
    super("listMediaObjects", "listmediaobjects", req, res);
    this.dataName = "mediaObjects";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListMediaObjectsManager(this._req, "rest");
  }
}

const listMediaObjects = async (req, res, next) => {
  const listMediaObjectsRestController = new ListMediaObjectsRestController(
    req,
    res,
  );
  try {
    await listMediaObjectsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listMediaObjects;
