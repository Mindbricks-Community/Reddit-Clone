const { CreateModmailMessageManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class CreateModmailMessageRestController extends ModerationRestController {
  constructor(req, res) {
    super("createModmailMessage", "createmodmailmessage", req, res);
    this.dataName = "modmailMessage";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateModmailMessageManager(this._req, "rest");
  }
}

const createModmailMessage = async (req, res, next) => {
  const createModmailMessageRestController =
    new CreateModmailMessageRestController(req, res);
  try {
    await createModmailMessageRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createModmailMessage;
