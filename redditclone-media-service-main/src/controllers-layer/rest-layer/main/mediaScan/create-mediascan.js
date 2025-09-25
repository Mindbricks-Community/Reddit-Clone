const { CreateMediaScanManager } = require("managers");

const MediaRestController = require("../../MediaServiceRestController");

class CreateMediaScanRestController extends MediaRestController {
  constructor(req, res) {
    super("createMediaScan", "createmediascan", req, res);
    this.dataName = "mediaScan";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateMediaScanManager(this._req, "rest");
  }
}

const createMediaScan = async (req, res, next) => {
  const createMediaScanRestController = new CreateMediaScanRestController(
    req,
    res,
  );
  try {
    await createMediaScanRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createMediaScan;
