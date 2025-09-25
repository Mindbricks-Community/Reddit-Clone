const { ListModmailMessagesManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class ListModmailMessagesRestController extends ModerationRestController {
  constructor(req, res) {
    super("listModmailMessages", "listmodmailmessages", req, res);
    this.dataName = "modmailMessages";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListModmailMessagesManager(this._req, "rest");
  }
}

const listModmailMessages = async (req, res, next) => {
  const listModmailMessagesRestController =
    new ListModmailMessagesRestController(req, res);
  try {
    await listModmailMessagesRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listModmailMessages;
