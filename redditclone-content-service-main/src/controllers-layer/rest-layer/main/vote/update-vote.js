const { UpdateVoteManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class UpdateVoteRestController extends ContentRestController {
  constructor(req, res) {
    super("updateVote", "updatevote", req, res);
    this.dataName = "vote";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateVoteManager(this._req, "rest");
  }
}

const updateVote = async (req, res, next) => {
  const updateVoteRestController = new UpdateVoteRestController(req, res);
  try {
    await updateVoteRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateVote;
