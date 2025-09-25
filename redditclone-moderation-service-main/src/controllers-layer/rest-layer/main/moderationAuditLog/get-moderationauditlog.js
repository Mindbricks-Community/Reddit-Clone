const { GetModerationAuditLogManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class GetModerationAuditLogRestController extends ModerationRestController {
  constructor(req, res) {
    super("getModerationAuditLog", "getmoderationauditlog", req, res);
    this.dataName = "moderationAuditLog";
    this.crudType = "get";
    this.status = 200;
    this.httpMethod = "GET";
  }

  createApiManager() {
    return new GetModerationAuditLogManager(this._req, "rest");
  }
}

const getModerationAuditLog = async (req, res, next) => {
  const getModerationAuditLogRestController =
    new GetModerationAuditLogRestController(req, res);
  try {
    await getModerationAuditLogRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = getModerationAuditLog;
