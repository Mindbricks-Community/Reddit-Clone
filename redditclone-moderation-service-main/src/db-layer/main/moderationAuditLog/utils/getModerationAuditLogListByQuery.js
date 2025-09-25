const { HttpServerError, BadRequestError } = require("common");

const { ModerationAuditLog } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getModerationAuditLogListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const moderationAuditLog = await ModerationAuditLog.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!moderationAuditLog || moderationAuditLog.length === 0) return [];

    //      if (!moderationAuditLog || moderationAuditLog.length === 0) {
    //      throw new NotFoundError(
    //      `ModerationAuditLog with the specified criteria not found`
    //  );
    //}

    return moderationAuditLog.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModerationAuditLogListByQuery",
      err,
    );
  }
};

module.exports = getModerationAuditLogListByQuery;
