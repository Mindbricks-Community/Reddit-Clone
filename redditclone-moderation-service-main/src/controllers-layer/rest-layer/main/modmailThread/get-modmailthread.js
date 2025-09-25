const { GetModmailThreadManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class GetModmailThreadRestController extends ModerationRestController {
  constructor(req, res) {
    super("getModmailThread", "getmodmailthread", req, res);
    this.dataName = "modmailThread";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetModmailThreadManager(this._req, "rest");
  }
}

const getModmailThread = async (req, res, next) => {
  const getModmailThreadRestController = new GetModmailThreadRestController(
    req,
    res,
  );
  try {
    await getModmailThreadRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getModmailThread;
