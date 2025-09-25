const { UpdateCommentManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class UpdateCommentRestController extends ContentRestController {
  constructor(req, res) {
    super("updateComment", "updatecomment", req, res);
    this.dataName = "comment";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateCommentManager(this._req, "rest");
  }
}

const updateComment = async (req, res, next) => {
  const updateCommentRestController = new UpdateCommentRestController(req, res);
  try {
    await updateCommentRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateComment;
