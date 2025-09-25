const { HttpServerError } = require("common");

let { ModerationAuditLog } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getModerationAuditLogById = async (moderationAuditLogId) => {
  try {
    const moderationAuditLog = Array.isArray(moderationAuditLogId)
      ? await ModerationAuditLog.findAll({
          where: {
            id: { [Op.in]: moderationAuditLogId },
            isActive: true,
          },
        })
      : await ModerationAuditLog.findOne({
          where: {
            id: moderationAuditLogId,
            isActive: true,
          },
        });

    if (!moderationAuditLog) {
      return null;
    }
    return Array.isArray(moderationAuditLogId)
      ? moderationAuditLog.map((item) => item.getData())
      : moderationAuditLog.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModerationAuditLogById",
      err,
    );
  }
};

module.exports = getModerationAuditLogById;
