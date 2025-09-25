const { GetModerationActionManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class GetModerationActionRestController extends ModerationRestController {
  constructor(req, res) {
    super("getModerationAction", "getmoderationaction", req, res);
    this.dataName = "moderationAction";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetModerationActionManager(this._req, "rest");
  }
}

const getModerationAction = async (req, res, next) => {
  const getModerationActionRestController =
    new GetModerationActionRestController(req, res);
  try {
    await getModerationActionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getModerationAction;
