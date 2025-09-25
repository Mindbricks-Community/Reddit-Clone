const { ListCommentsManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class ListCommentsRestController extends ContentRestController {
  constructor(req, res) {
    super("listComments", "listcomments", req, res);
    this.dataName = "comments";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListCommentsManager(this._req, "rest");
  }
}

const listComments = async (req, res, next) => {
  const listCommentsRestController = new ListCommentsRestController(req, res);
  try {
    await listCommentsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listComments;
