const { GetGdprExportRequestManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class GetGdprExportRequestRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("getGdprExportRequest", "getgdprexportrequest", req, res);
    this.dataName = "gdprExportRequest";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetGdprExportRequestManager(this._req, "rest");
  }
}

const getGdprExportRequest = async (req, res, next) => {
  const getGdprExportRequestRestController =
    new GetGdprExportRequestRestController(req, res);
  try {
    await getGdprExportRequestRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getGdprExportRequest;
