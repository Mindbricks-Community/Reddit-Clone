const { ListPostsManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class ListPostsRestController extends ContentRestController {
  constructor(req, res) {
    super("listPosts", "listposts", req, res);
    this.dataName = "posts";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListPostsManager(this._req, "rest");
  }
}

const listPosts = async (req, res, next) => {
  const listPostsRestController = new ListPostsRestController(req, res);
  try {
    await listPostsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listPosts;
