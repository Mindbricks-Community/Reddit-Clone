const { GetMediaScanManager } = require("managers");

const MediaRestController = require("../../MediaServiceRestController");

class GetMediaScanRestController extends MediaRestController {
  constructor(req, res) {
    super("getMediaScan", "getmediascan", req, res);
    this.dataName = "mediaScan";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetMediaScanManager(this._req, "rest");
  }
}

const getMediaScan = async (req, res, next) => {
  const getMediaScanRestController = new GetMediaScanRestController(req, res);
  try {
    await getMediaScanRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getMediaScan;
