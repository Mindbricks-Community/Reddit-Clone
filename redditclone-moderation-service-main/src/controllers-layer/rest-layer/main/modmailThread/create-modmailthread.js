const { CreateModmailThreadManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class CreateModmailThreadRestController extends ModerationRestController {
  constructor(req, res) {
    super("createModmailThread", "createmodmailthread", req, res);
    this.dataName = "modmailThread";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateModmailThreadManager(this._req, "rest");
  }
}

const createModmailThread = async (req, res, next) => {
  const createModmailThreadRestController =
    new CreateModmailThreadRestController(req, res);
  try {
    await createModmailThreadRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createModmailThread;
