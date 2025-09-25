const { UpdateMediaObjectManager } = require("managers");

const MediaRestController = require("../../MediaServiceRestController");

class UpdateMediaObjectRestController extends MediaRestController {
  constructor(req, res) {
    super("updateMediaObject", "updatemediaobject", req, res);
    this.dataName = "mediaObject";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateMediaObjectManager(this._req, "rest");
  }
}

const updateMediaObject = async (req, res, next) => {
  const updateMediaObjectRestController = new UpdateMediaObjectRestController(
    req,
    res,
  );
  try {
    await updateMediaObjectRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateMediaObject;
