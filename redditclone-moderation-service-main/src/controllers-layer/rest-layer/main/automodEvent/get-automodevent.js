const { GetAutomodEventManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class GetAutomodEventRestController extends ModerationRestController {
  constructor(req, res) {
    super("getAutomodEvent", "getautomodevent", req, res);
    this.dataName = "automodEvent";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetAutomodEventManager(this._req, "rest");
  }
}

const getAutomodEvent = async (req, res, next) => {
  const getAutomodEventRestController = new GetAutomodEventRestController(
    req,
    res,
  );
  try {
    await getAutomodEventRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getAutomodEvent;
