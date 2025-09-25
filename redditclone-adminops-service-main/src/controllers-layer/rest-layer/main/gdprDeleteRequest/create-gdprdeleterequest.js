const { CreateGdprDeleteRequestManager } = require("managers");

const AdminOpsRestController = require("../../AdminOpsServiceRestController");

class CreateGdprDeleteRequestRestController extends AdminOpsRestController {
  constructor(req, res) {
    super("createGdprDeleteRequest", "creategdprdeleterequest", req, res);
    this.dataName = "gdprDeleteRequest";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateGdprDeleteRequestManager(this._req, "rest");
  }
}

const createGdprDeleteRequest = async (req, res, next) => {
  const createGdprDeleteRequestRestController =
    new CreateGdprDeleteRequestRestController(req, res);
  try {
    await createGdprDeleteRequestRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createGdprDeleteRequest;
