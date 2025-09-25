const { ListPostMediaManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class ListPostMediaRestController extends ContentRestController {
  constructor(req, res) {
    super("listPostMedia", "listpostmedia", req, res);
    this.dataName = "postMedias";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListPostMediaManager(this._req, "rest");
  }
}

const listPostMedia = async (req, res, next) => {
  const listPostMediaRestController = new ListPostMediaRestController(req, res);
  try {
    await listPostMediaRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listPostMedia;
