const { ListAutomodEventsManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class ListAutomodEventsRestController extends ModerationRestController {
  constructor(req, res) {
    super("listAutomodEvents", "listautomodevents", req, res);
    this.dataName = "automodEvents";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListAutomodEventsManager(this._req, "rest");
  }
}

const listAutomodEvents = async (req, res, next) => {
  const listAutomodEventsRestController = new ListAutomodEventsRestController(
    req,
    res,
  );
  try {
    await listAutomodEventsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listAutomodEvents;
