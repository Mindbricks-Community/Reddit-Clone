const { UpdateModerationAuditLogManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class UpdateModerationAuditLogRestController extends ModerationRestController {
  constructor(req, res) {
    super("updateModerationAuditLog", "updatemoderationauditlog", req, res);
    this.dataName = "moderationAuditLog";
    this.crudType = "update";
    this.status = 200;
    this.httpMethod = "PATCH";
  }

  createApiManager() {
    return new UpdateModerationAuditLogManager(this._req, "rest");
  }
}

const updateModerationAuditLog = async (req, res, next) => {
  const updateModerationAuditLogRestController =
    new UpdateModerationAuditLogRestController(req, res);
  try {
    await updateModerationAuditLogRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = updateModerationAuditLog;
