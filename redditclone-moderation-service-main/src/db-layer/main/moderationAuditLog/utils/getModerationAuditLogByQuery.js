const { HttpServerError, BadRequestError } = require("common");

const { ModerationAuditLog } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getModerationAuditLogByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const moderationAuditLog = await ModerationAuditLog.findOne({
      where: { ...query, isActive: true },
    });

    if (!moderationAuditLog) return null;
    return moderationAuditLog.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModerationAuditLogByQuery",
      err,
    );
  }
};

module.exports = getModerationAuditLogByQuery;
