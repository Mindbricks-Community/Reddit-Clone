const { DeleteAutomodEventManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class DeleteAutomodEventRestController extends ModerationRestController {
  constructor(req, res) {
    super("deleteAutomodEvent", "deleteautomodevent", req, res);
    this.dataName = "automodEvent";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteAutomodEventManager(this._req, "rest");
  }
}

const deleteAutomodEvent = async (req, res, next) => {
  const deleteAutomodEventRestController = new DeleteAutomodEventRestController(
    req,
    res,
  );
  try {
    await deleteAutomodEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteAutomodEvent;
