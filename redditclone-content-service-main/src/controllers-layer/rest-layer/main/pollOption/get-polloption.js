const { GetPollOptionManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class GetPollOptionRestController extends ContentRestController {
  constructor(req, res) {
    super("getPollOption", "getpolloption", req, res);
    this.dataName = "pollOption";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetPollOptionManager(this._req, "rest");
  }
}

const getPollOption = async (req, res, next) => {
  const getPollOptionRestController = new GetPollOptionRestController(req, res);
  try {
    await getPollOptionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getPollOption;
