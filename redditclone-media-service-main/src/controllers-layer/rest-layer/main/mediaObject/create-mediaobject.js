const { CreateMediaObjectManager } = require("managers");

const MediaRestController = require("../../MediaServiceRestController");

class CreateMediaObjectRestController extends MediaRestController {
  constructor(req, res) {
    super("createMediaObject", "createmediaobject", req, res);
    this.dataName = "mediaObject";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateMediaObjectManager(this._req, "rest");
  }
}

const createMediaObject = async (req, res, next) => {
  const createMediaObjectRestController = new CreateMediaObjectRestController(
    req,
    res,
  );
  try {
    await createMediaObjectRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createMediaObject;
