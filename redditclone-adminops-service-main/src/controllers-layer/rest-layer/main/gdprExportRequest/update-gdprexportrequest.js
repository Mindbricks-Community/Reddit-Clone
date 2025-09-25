const { UpdateGdprExportRequestManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class UpdateGdprExportRequestRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("updateGdprExportRequest", "updategdprexportrequest", req, res);
    this.dataName = "gdprExportRequest";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateGdprExportRequestManager(this._req, "rest");
  }
}

const updateGdprExportRequest = async (req, res, next) => {
  const updateGdprExportRequestRestController =
    new UpdateGdprExportRequestRestController(req, res);
  try {
    await updateGdprExportRequestRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateGdprExportRequest;
