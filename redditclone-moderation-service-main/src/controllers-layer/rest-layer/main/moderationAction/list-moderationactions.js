const { ListModerationActionsManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class ListModerationActionsRestController extends ModerationRestController {
  constructor(req, res) {
    super("listModerationActions", "listmoderationactions", req, res);
    this.dataName = "moderationActions";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListModerationActionsManager(this._req, "rest");
  }
}

const listModerationActions = async (req, res, next) => {
  const listModerationActionsRestController =
    new ListModerationActionsRestController(req, res);
  try {
    await listModerationActionsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listModerationActions;
