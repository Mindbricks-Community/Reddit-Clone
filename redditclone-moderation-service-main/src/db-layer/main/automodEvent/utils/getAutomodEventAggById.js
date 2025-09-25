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

const getAutomodEventAggById = async (automodEventId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const automodEvent = Array.isArray(automodEventId)
      ? await AutomodEvent.findAll({
          where: {
            id: { [Op.in]: automodEventId },
            isActive: true,
          },
          include: includes,
        })
      : await AutomodEvent.findOne({
          where: {
            id: automodEventId,
            isActive: true,
          },
          include: includes,
        });

    if (!automodEvent) {
      return null;
    }

    const automodEventData =
      Array.isArray(automodEventId) && automodEventId.length > 0
        ? automodEvent.map((item) => item.getData())
        : automodEvent.getData();
    await AutomodEvent.getCqrsJoins(automodEventData);
    return automodEventData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAutomodEventAggById",
      err,
    );
  }
};

module.exports = getAutomodEventAggById;
