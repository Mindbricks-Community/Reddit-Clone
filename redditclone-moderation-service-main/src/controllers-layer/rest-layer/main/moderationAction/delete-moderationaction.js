const { DeleteModerationActionManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class DeleteModerationActionRestController extends ModerationRestController {
  constructor(req, res) {
    super("deleteModerationAction", "deletemoderationaction", req, res);
    this.dataName = "moderationAction";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteModerationActionManager(this._req, "rest");
  }
}

const deleteModerationAction = async (req, res, next) => {
  const deleteModerationActionRestController =
    new DeleteModerationActionRestController(req, res);
  try {
    await deleteModerationActionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteModerationAction;
