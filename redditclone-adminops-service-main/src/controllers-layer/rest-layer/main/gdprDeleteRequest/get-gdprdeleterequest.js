const { GetGdprDeleteRequestManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class GetGdprDeleteRequestRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("getGdprDeleteRequest", "getgdprdeleterequest", req, res);
    this.dataName = "gdprDeleteRequest";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetGdprDeleteRequestManager(this._req, "rest");
  }
}

const getGdprDeleteRequest = async (req, res, next) => {
  const getGdprDeleteRequestRestController =
    new GetGdprDeleteRequestRestController(req, res);
  try {
    await getGdprDeleteRequestRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getGdprDeleteRequest;
