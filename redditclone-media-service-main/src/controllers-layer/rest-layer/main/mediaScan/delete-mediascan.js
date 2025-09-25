const { DeleteMediaScanManager } = require("managers");

const MediaRestController = require("../../MediaServiceRestController");

class DeleteMediaScanRestController extends MediaRestController {
  constructor(req, res) {
    super("deleteMediaScan", "deletemediascan", req, res);
    this.dataName = "mediaScan";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteMediaScanManager(this._req, "rest");
  }
}

const deleteMediaScan = async (req, res, next) => {
  const deleteMediaScanRestController = new DeleteMediaScanRestController(
    req,
    res,
  );
  try {
    await deleteMediaScanRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteMediaScan;
