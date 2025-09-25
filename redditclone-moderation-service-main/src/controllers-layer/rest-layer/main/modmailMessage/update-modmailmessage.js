const { UpdateModmailMessageManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class UpdateModmailMessageRestController extends ModerationRestController {
  constructor(req, res) {
    super("updateModmailMessage", "updatemodmailmessage", req, res);
    this.dataName = "modmailMessage";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateModmailMessageManager(this._req, "rest");
  }
}

const updateModmailMessage = async (req, res, next) => {
  const updateModmailMessageRestController =
    new UpdateModmailMessageRestController(req, res);
  try {
    await updateModmailMessageRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateModmailMessage;
