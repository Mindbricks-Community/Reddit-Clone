const { DeleteModmailThreadManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class DeleteModmailThreadRestController extends ModerationRestController {
  constructor(req, res) {
    super("deleteModmailThread", "deletemodmailthread", req, res);
    this.dataName = "modmailThread";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteModmailThreadManager(this._req, "rest");
  }
}

const deleteModmailThread = async (req, res, next) => {
  const deleteModmailThreadRestController =
    new DeleteModmailThreadRestController(req, res);
  try {
    await deleteModmailThreadRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteModmailThread;
