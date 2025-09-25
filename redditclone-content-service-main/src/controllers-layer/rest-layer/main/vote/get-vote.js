const { GetVoteManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class GetVoteRestController extends ContentRestController {
  constructor(req, res) {
    super("getVote", "getvote", req, res);
    this.dataName = "vote";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetVoteManager(this._req, "rest");
  }
}

const getVote = async (req, res, next) => {
  const getVoteRestController = new GetVoteRestController(req, res);
  try {
    await getVoteRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getVote;
