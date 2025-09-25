const { AddPostMediaManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class AddPostMediaRestController extends ContentRestController {
  constructor(req, res) {
    super("addPostMedia", "addpostmedia", req, res);
    this.dataName = "postMedia";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new AddPostMediaManager(this._req, "rest");
  }
}

const addPostMedia = async (req, res, next) => {
  const addPostMediaRestController = new AddPostMediaRestController(req, res);
  try {
    await addPostMediaRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = addPostMedia;
