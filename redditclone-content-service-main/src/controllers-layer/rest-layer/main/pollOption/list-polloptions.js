const { ListPollOptionsManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class ListPollOptionsRestController extends ContentRestController {
  constructor(req, res) {
    super("listPollOptions", "listpolloptions", req, res);
    this.dataName = "pollOptions";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListPollOptionsManager(this._req, "rest");
  }
}

const listPollOptions = async (req, res, next) => {
  const listPollOptionsRestController = new ListPollOptionsRestController(
    req,
    res,
  );
  try {
    await listPollOptionsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listPollOptions;
