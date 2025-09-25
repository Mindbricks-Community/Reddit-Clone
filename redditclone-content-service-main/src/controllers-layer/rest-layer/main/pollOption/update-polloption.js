const { UpdatePollOptionManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class UpdatePollOptionRestController extends ContentRestController {
  constructor(req, res) {
    super("updatePollOption", "updatepolloption", req, res);
    this.dataName = "pollOption";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdatePollOptionManager(this._req, "rest");
  }
}

const updatePollOption = async (req, res, next) => {
  const updatePollOptionRestController = new UpdatePollOptionRestController(
    req,
    res,
  );
  try {
    await updatePollOptionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updatePollOption;
