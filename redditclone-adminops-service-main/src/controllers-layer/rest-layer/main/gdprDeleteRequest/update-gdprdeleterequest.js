const { UpdateGdprDeleteRequestManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class UpdateGdprDeleteRequestRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("updateGdprDeleteRequest", "updategdprdeleterequest", req, res);
    this.dataName = "gdprDeleteRequest";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateGdprDeleteRequestManager(this._req, "rest");
  }
}

const updateGdprDeleteRequest = async (req, res, next) => {
  const updateGdprDeleteRequestRestController =
    new UpdateGdprDeleteRequestRestController(req, res);
  try {
    await updateGdprDeleteRequestRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateGdprDeleteRequest;
