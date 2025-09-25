const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const {
  ModerationAction,
  AutomodEvent,
  ModerationAuditLog,
  ModmailThread,
  ModmailMessage,
} = require("models");
const { Op } = require("sequelize");

const getModerationAuditLogAggById = async (moderationAuditLogId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const moderationAuditLog = Array.isArray(moderationAuditLogId)
      ? await ModerationAuditLog.findAll({
          where: {
            id: { [Op.in]: moderationAuditLogId },
            isActive: true,
          },
          include: includes,
        })
      : await ModerationAuditLog.findOne({
          where: {
            id: moderationAuditLogId,
            isActive: true,
          },
          include: includes,
        });

    if (!moderationAuditLog) {
      return null;
    }

    const moderationAuditLogData =
      Array.isArray(moderationAuditLogId) && moderationAuditLogId.length > 0
        ? moderationAuditLog.map((item) => item.getData())
        : moderationAuditLog.getData();
    await ModerationAuditLog.getCqrsJoins(moderationAuditLogData);
    return moderationAuditLogData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModerationAuditLogAggById",
      err,
    );
  }
};

module.exports = getModerationAuditLogAggById;
