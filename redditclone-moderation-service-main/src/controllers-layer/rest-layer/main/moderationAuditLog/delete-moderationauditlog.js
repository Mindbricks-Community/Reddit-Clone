const { DeleteModerationAuditLogManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class DeleteModerationAuditLogRestController extends ModerationRestController {
  constructor(req, res) {
    super("deleteModerationAuditLog", "deletemoderationauditlog", req, res);
    this.dataName = "moderationAuditLog";
    this.crudType = "delete";
    this.status = 200;
    this.httpMethod = "DELETE";
  }

  createApiManager() {
    return new DeleteModerationAuditLogManager(this._req, "rest");
  }
}

const deleteModerationAuditLog = async (req, res, next) => {
  const deleteModerationAuditLogRestController =
    new DeleteModerationAuditLogRestController(req, res);
  try {
    await deleteModerationAuditLogRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = deleteModerationAuditLog;
