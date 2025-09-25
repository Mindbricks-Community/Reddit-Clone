const { CreatePostManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class CreatePostRestController extends ContentRestController {
  constructor(req, res) {
    super("createPost", "createpost", req, res);
    this.dataName = "post";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreatePostManager(this._req, "rest");
  }
}

const createPost = async (req, res, next) => {
  const createPostRestController = new CreatePostRestController(req, res);
  try {
    await createPostRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createPost;
