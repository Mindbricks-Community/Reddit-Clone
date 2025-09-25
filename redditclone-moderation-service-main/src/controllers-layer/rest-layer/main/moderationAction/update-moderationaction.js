const { UpdateModerationActionManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class UpdateModerationActionRestController extends ModerationRestController {
  constructor(req, res) {
    super("updateModerationAction", "updatemoderationaction", req, res);
    this.dataName = "moderationAction";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateModerationActionManager(this._req, "rest");
  }
}

const updateModerationAction = async (req, res, next) => {
  const updateModerationActionRestController =
    new UpdateModerationActionRestController(req, res);
  try {
    await updateModerationActionRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateModerationAction;
