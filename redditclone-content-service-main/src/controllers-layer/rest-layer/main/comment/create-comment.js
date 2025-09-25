const { CreateCommentManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class CreateCommentRestController extends ContentRestController {
  constructor(req, res) {
    super("createComment", "createcomment", req, res);
    this.dataName = "comment";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateCommentManager(this._req, "rest");
  }
}

const createComment = async (req, res, next) => {
  const createCommentRestController = new CreateCommentRestController(req, res);
  try {
    await createCommentRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createComment;
