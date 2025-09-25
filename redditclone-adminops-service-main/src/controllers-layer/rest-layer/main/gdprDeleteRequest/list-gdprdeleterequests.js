const { ListGdprDeleteRequestsManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class ListGdprDeleteRequestsRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("listGdprDeleteRequests", "listgdprdeleterequests", req, res);
    this.dataName = "gdprDeleteRequests";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListGdprDeleteRequestsManager(this._req, "rest");
  }
}

const listGdprDeleteRequests = async (req, res, next) => {
  const listGdprDeleteRequestsRestController =
    new ListGdprDeleteRequestsRestController(req, res);
  try {
    await listGdprDeleteRequestsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listGdprDeleteRequests;
