const { GetPostManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class GetPostRestController extends ContentRestController {
  constructor(req, res) {
    super("getPost", "getpost", req, res);
    this.dataName = "post";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetPostManager(this._req, "rest");
  }
}

const getPost = async (req, res, next) => {
  const getPostRestController = new GetPostRestController(req, res);
  try {
    await getPostRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getPost;
