const { DeleteCommentManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class DeleteCommentRestController extends ContentRestController {
  constructor(req, res) {
    super("deleteComment", "deletecomment", req, res);
    this.dataName = "comment";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteCommentManager(this._req, "rest");
  }
}

const deleteComment = async (req, res, next) => {
  const deleteCommentRestController = new DeleteCommentRestController(req, res);
  try {
    await deleteCommentRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteComment;
