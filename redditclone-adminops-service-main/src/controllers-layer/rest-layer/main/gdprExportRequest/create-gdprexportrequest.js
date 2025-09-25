const { CreateGdprExportRequestManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class CreateGdprExportRequestRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("createGdprExportRequest", "creategdprexportrequest", req, res);
    this.dataName = "gdprExportRequest";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateGdprExportRequestManager(this._req, "rest");
  }
}

const createGdprExportRequest = async (req, res, next) => {
  const createGdprExportRequestRestController =
    new CreateGdprExportRequestRestController(req, res);
  try {
    await createGdprExportRequestRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createGdprExportRequest;
