const { GetMediaObjectManager } = require("managers");

const MediaRestController = require("../../MediaServiceRestController");

class GetMediaObjectRestController extends MediaRestController {
  constructor(req, res) {
    super("getMediaObject", "getmediaobject", req, res);
    this.dataName = "mediaObject";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetMediaObjectManager(this._req, "rest");
  }
}

const getMediaObject = async (req, res, next) => {
  const getMediaObjectRestController = new GetMediaObjectRestController(
    req,
    res,
  );
  try {
    await getMediaObjectRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getMediaObject;
