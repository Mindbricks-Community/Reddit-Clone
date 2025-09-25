const { DeletePostManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class DeletePostRestController extends ContentRestController {
  constructor(req, res) {
    super("deletePost", "deletepost", req, res);
    this.dataName = "post";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeletePostManager(this._req, "rest");
  }
}

const deletePost = async (req, res, next) => {
  const deletePostRestController = new DeletePostRestController(req, res);
  try {
    await deletePostRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deletePost;
