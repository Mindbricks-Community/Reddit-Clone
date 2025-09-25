const { CreateModerationActionManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class CreateModerationActionRestController extends ModerationRestController {
  constructor(req, res) {
    super("createModerationAction", "createmoderationaction", req, res);
    this.dataName = "moderationAction";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateModerationActionManager(this._req, "rest");
  }
}

const createModerationAction = async (req, res, next) => {
  const createModerationActionRestController =
    new CreateModerationActionRestController(req, res);
  try {
    await createModerationActionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createModerationAction;
