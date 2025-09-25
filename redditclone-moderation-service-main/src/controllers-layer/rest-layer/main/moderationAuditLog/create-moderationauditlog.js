const { CreateModerationAuditLogManager } = require("managers");

const ModerationRestController = require("../../ModerationServiceRestController");

class CreateModerationAuditLogRestController extends ModerationRestController {
  constructor(req, res) {
    super("createModerationAuditLog", "createmoderationauditlog", req, res);
    this.dataName = "moderationAuditLog";
    this.crudType = "create";
    this.status = 201;
    this.httpMethod = "POST";
  }

  createApiManager() {
    return new CreateModerationAuditLogManager(this._req, "rest");
  }
}

const createModerationAuditLog = async (req, res, next) => {
  const createModerationAuditLogRestController =
    new CreateModerationAuditLogRestController(req, res);
  try {
    await createModerationAuditLogRestController.processRequest();
  } catch (err) {
    return next(err);
  }
};

module.exports = createModerationAuditLog;
