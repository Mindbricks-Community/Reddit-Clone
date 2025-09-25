const { UpdatePostManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class UpdatePostRestController extends ContentRestController {
  constructor(req, res) {
    super("updatePost", "updatepost", req, res);
    this.dataName = "post";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdatePostManager(this._req, "rest");
  }
}

const updatePost = async (req, res, next) => {
  const updatePostRestController = new UpdatePostRestController(req, res);
  try {
    await updatePostRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updatePost;
