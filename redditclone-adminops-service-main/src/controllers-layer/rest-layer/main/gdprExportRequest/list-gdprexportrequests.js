const { ListGdprExportRequestsManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class ListGdprExportRequestsRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("listGdprExportRequests", "listgdprexportrequests", req, res);
    this.dataName = "gdprExportRequests";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListGdprExportRequestsManager(this._req, "rest");
  }
}

const listGdprExportRequests = async (req, res, next) => {
  const listGdprExportRequestsRestController =
    new ListGdprExportRequestsRestController(req, res);
  try {
    await listGdprExportRequestsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listGdprExportRequests;
