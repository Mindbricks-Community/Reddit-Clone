const { GetCommentManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class GetCommentRestController extends ContentRestController {
  constructor(req, res) {
    super("getComment", "getcomment", req, res);
    this.dataName = "comment";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetCommentManager(this._req, "rest");
  }
}

const getComment = async (req, res, next) => {
  const getCommentRestController = new GetCommentRestController(req, res);
  try {
    await getCommentRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getComment;
