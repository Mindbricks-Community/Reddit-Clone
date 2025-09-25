const { ListModerationAuditLogsManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class ListModerationAuditLogsRestController extends ModerationRestController {
  constructor(req, res) {
    super("listModerationAuditLogs", "listmoderationauditlogs", req, res);
    this.dataName = "moderationAuditLogs";
    this.crudType = "getList";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new ListModerationAuditLogsManager(this._req, "rest");
  }
}

const listModerationAuditLogs = async (req, res, next) => {
  const listModerationAuditLogsRestController =
    new ListModerationAuditLogsRestController(req, res);
  try {
    await listModerationAuditLogsRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = listModerationAuditLogs;
