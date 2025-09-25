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

const getModmailMessageAggById = async (modmailMessageId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const modmailMessage = Array.isArray(modmailMessageId)
      ? await ModmailMessage.findAll({
          where: {
            id: { [Op.in]: modmailMessageId },
            isActive: true,
          },
          include: includes,
        })
      : await ModmailMessage.findOne({
          where: {
            id: modmailMessageId,
            isActive: true,
          },
          include: includes,
        });

    if (!modmailMessage) {
      return null;
    }

    const modmailMessageData =
      Array.isArray(modmailMessageId) && modmailMessageId.length > 0
        ? modmailMessage.map((item) => item.getData())
        : modmailMessage.getData();
    await ModmailMessage.getCqrsJoins(modmailMessageData);
    return modmailMessageData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModmailMessageAggById",
      err,
    );
  }
};

module.exports = getModmailMessageAggById;
