const { DeleteModmailMessageManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class DeleteModmailMessageRestController extends ModerationRestController {
  constructor(req, res) {
    super("deleteModmailMessage", "deletemodmailmessage", req, res);
    this.dataName = "modmailMessage";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteModmailMessageManager(this._req, "rest");
  }
}

const deleteModmailMessage = async (req, res, next) => {
  const deleteModmailMessageRestController =
    new DeleteModmailMessageRestController(req, res);
  try {
    await deleteModmailMessageRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteModmailMessage;
