const { GetPostMediaManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class GetPostMediaRestController extends ContentRestController {
  constructor(req, res) {
    super("getPostMedia", "getpostmedia", req, res);
    this.dataName = "postMedia";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetPostMediaManager(this._req, "rest");
  }
}

const getPostMedia = async (req, res, next) => {
  const getPostMediaRestController = new GetPostMediaRestController(req, res);
  try {
    await getPostMediaRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getPostMedia;
