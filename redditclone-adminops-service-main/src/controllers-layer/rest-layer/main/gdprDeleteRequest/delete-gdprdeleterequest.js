const { DeleteGdprDeleteRequestManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class DeleteGdprDeleteRequestRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("deleteGdprDeleteRequest", "deletegdprdeleterequest", req, res);
    this.dataName = "gdprDeleteRequest";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteGdprDeleteRequestManager(this._req, "rest");
  }
}

const deleteGdprDeleteRequest = async (req, res, next) => {
  const deleteGdprDeleteRequestRestController =
    new DeleteGdprDeleteRequestRestController(req, res);
  try {
    await deleteGdprDeleteRequestRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteGdprDeleteRequest;
