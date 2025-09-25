const { GetModmailMessageManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class GetModmailMessageRestController extends ModerationRestController {
  constructor(req, res) {
    super("getModmailMessage", "getmodmailmessage", req, res);
    this.dataName = "modmailMessage";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetModmailMessageManager(this._req, "rest");
  }
}

const getModmailMessage = async (req, res, next) => {
  const getModmailMessageRestController = new GetModmailMessageRestController(
    req,
    res,
  );
  try {
    await getModmailMessageRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getModmailMessage;
