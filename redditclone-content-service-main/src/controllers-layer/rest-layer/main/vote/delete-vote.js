const { DeleteVoteManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class DeleteVoteRestController extends ContentRestController {
  constructor(req, res) {
    super("deleteVote", "deletevote", req, res);
    this.dataName = "vote";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteVoteManager(this._req, "rest");
  }
}

const deleteVote = async (req, res, next) => {
  const deleteVoteRestController = new DeleteVoteRestController(req, res);
  try {
    await deleteVoteRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteVote;
