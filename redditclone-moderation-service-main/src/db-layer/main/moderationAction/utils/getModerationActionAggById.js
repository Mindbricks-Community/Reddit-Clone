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

const getModerationActionAggById = async (moderationActionId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const moderationAction = Array.isArray(moderationActionId)
      ? await ModerationAction.findAll({
          where: {
            id: { [Op.in]: moderationActionId },
            isActive: true,
          },
          include: includes,
        })
      : await ModerationAction.findOne({
          where: {
            id: moderationActionId,
            isActive: true,
          },
          include: includes,
        });

    if (!moderationAction) {
      return null;
    }

    const moderationActionData =
      Array.isArray(moderationActionId) && moderationActionId.length > 0
        ? moderationAction.map((item) => item.getData())
        : moderationAction.getData();
    await ModerationAction.getCqrsJoins(moderationActionData);
    return moderationActionData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModerationActionAggById",
      err,
    );
  }
};

module.exports = getModerationActionAggById;
