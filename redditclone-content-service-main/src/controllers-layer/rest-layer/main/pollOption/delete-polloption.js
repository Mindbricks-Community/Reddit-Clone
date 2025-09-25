const { DeletePollOptionManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class DeletePollOptionRestController extends ContentRestController {
  constructor(req, res) {
    super("deletePollOption", "deletepolloption", req, res);
    this.dataName = "pollOption";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeletePollOptionManager(this._req, "rest");
  }
}

const deletePollOption = async (req, res, next) => {
  const deletePollOptionRestController = new DeletePollOptionRestController(
    req,
    res,
  );
  try {
    await deletePollOptionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deletePollOption;
