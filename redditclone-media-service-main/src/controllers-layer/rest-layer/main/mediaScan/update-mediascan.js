const { UpdateMediaScanManager } = require("managers");

const MediaRestController = require("../../MediaServiceRestController");

class UpdateMediaScanRestController extends MediaRestController {
  constructor(req, res) {
    super("updateMediaScan", "updatemediascan", req, res);
    this.dataName = "mediaScan";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateMediaScanManager(this._req, "rest");
  }
}

const updateMediaScan = async (req, res, next) => {
  const updateMediaScanRestController = new UpdateMediaScanRestController(
    req,
    res,
  );
  try {
    await updateMediaScanRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateMediaScan;
