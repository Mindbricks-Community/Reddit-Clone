const { UpdatePostMediaManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class UpdatePostMediaRestController extends ContentRestController {
  constructor(req, res) {
    super("updatePostMedia", "updatepostmedia", req, res);
    this.dataName = "postMedia";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdatePostMediaManager(this._req, "rest");
  }
}

const updatePostMedia = async (req, res, next) => {
  const updatePostMediaRestController = new UpdatePostMediaRestController(
    req,
    res,
  );
  try {
    await updatePostMediaRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updatePostMedia;
