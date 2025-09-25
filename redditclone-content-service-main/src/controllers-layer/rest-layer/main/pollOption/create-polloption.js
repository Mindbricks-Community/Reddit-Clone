const { CreatePollOptionManager } = require("managers");

const ContentRestController = require("../../ContentServiceRestController");

class CreatePollOptionRestController extends ContentRestController {
  constructor(req, res) {
    super("createPollOption", "createpolloption", req, res);
    this.dataName = "pollOption";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreatePollOptionManager(this._req, "rest");
  }
}

const createPollOption = async (req, res, next) => {
  const createPollOptionRestController = new CreatePollOptionRestController(
    req,
    res,
  );
  try {
    await createPollOptionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createPollOption;
