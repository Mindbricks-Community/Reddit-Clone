const { DeleteGdprExportRequestManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class DeleteGdprExportRequestRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("deleteGdprExportRequest", "deletegdprexportrequest", req, res);
    this.dataName = "gdprExportRequest";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteGdprExportRequestManager(this._req, "rest");
  }
}

const deleteGdprExportRequest = async (req, res, next) => {
  const deleteGdprExportRequestRestController =
    new DeleteGdprExportRequestRestController(req, res);
  try {
    await deleteGdprExportRequestRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteGdprExportRequest;
