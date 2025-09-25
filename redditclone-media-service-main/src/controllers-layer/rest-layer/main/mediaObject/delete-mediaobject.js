const { DeleteMediaObjectManager } = require("managers");

const MediaRestController = require("../../MediaServiceRestController");

class DeleteMediaObjectRestController extends MediaRestController {
  constructor(req, res) {
    super("deleteMediaObject", "deletemediaobject", req, res);
    this.dataName = "mediaObject";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteMediaObjectManager(this._req, "rest");
  }
}

const deleteMediaObject = async (req, res, next) => {
  const deleteMediaObjectRestController = new DeleteMediaObjectRestController(
    req,
    res,
  );
  try {
    await deleteMediaObjectRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteMediaObject;
