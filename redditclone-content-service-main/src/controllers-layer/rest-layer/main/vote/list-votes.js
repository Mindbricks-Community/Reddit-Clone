const { ListVotesManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class ListVotesRestController extends ContentRestController {
  constructor(req, res) {
    super("listVotes", "listvotes", req, res);
    this.dataName = "votes";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListVotesManager(this._req, "rest");
  }
}

const listVotes = async (req, res, next) => {
  const listVotesRestController = new ListVotesRestController(req, res);
  try {
    await listVotesRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listVotes;
