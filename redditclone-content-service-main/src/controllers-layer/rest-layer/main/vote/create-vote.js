const { CreateVoteManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class CreateVoteRestController extends ContentRestController {
  constructor(req, res) {
    super("createVote", "createvote", req, res);
    this.dataName = "vote";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateVoteManager(this._req, "rest");
  }
}

const createVote = async (req, res, next) => {
  const createVoteRestController = new CreateVoteRestController(req, res);
  try {
    await createVoteRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createVote;
