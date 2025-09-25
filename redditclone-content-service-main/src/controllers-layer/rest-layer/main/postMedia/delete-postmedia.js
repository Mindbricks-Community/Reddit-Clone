const { DeletePostMediaManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class DeletePostMediaRestController extends ContentRestController {
  constructor(req, res) {
    super("deletePostMedia", "deletepostmedia", req, res);
    this.dataName = "postMedia";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeletePostMediaManager(this._req, "rest");
  }
}

const deletePostMedia = async (req, res, next) => {
  const deletePostMediaRestController = new DeletePostMediaRestController(
    req,
    res,
  );
  try {
    await deletePostMediaRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deletePostMedia;
