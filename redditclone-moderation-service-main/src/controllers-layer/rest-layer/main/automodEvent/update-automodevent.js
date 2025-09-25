const { UpdateAutomodEventManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class UpdateAutomodEventRestController extends ModerationRestController {
  constructor(req, res) {
    super("updateAutomodEvent", "updateautomodevent", req, res);
    this.dataName = "automodEvent";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateAutomodEventManager(this._req, "rest");
  }
}

const updateAutomodEvent = async (req, res, next) => {
  const updateAutomodEventRestController = new UpdateAutomodEventRestController(
    req,
    res,
  );
  try {
    await updateAutomodEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateAutomodEvent;
