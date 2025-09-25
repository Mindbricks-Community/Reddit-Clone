const { ListModmailThreadsManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class ListModmailThreadsRestController extends ModerationRestController {
  constructor(req, res) {
    super("listModmailThreads", "listmodmailthreads", req, res);
    this.dataName = "modmailThreads";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListModmailThreadsManager(this._req, "rest");
  }
}

const listModmailThreads = async (req, res, next) => {
  const listModmailThreadsRestController = new ListModmailThreadsRestController(
    req,
    res,
  );
  try {
    await listModmailThreadsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listModmailThreads;
