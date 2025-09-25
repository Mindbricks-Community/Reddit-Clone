const { CreateAutomodEventManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class CreateAutomodEventRestController extends ModerationRestController {
  constructor(req, res) {
    super("createAutomodEvent", "createautomodevent", req, res);
    this.dataName = "automodEvent";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateAutomodEventManager(this._req, "rest");
  }
}

const createAutomodEvent = async (req, res, next) => {
  const createAutomodEventRestController = new CreateAutomodEventRestController(
    req,
    res,
  );
  try {
    await createAutomodEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createAutomodEvent;
