const { UpdateModmailThreadManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class UpdateModmailThreadRestController extends ModerationRestController {
  constructor(req, res) {
    super("updateModmailThread", "updatemodmailthread", req, res);
    this.dataName = "modmailThread";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateModmailThreadManager(this._req, "rest");
  }
}

const updateModmailThread = async (req, res, next) => {
  const updateModmailThreadRestController =
    new UpdateModmailThreadRestController(req, res);
  try {
    await updateModmailThreadRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateModmailThread;
