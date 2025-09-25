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

const getModmailThreadAggById = async (modmailThreadId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const modmailThread = Array.isArray(modmailThreadId)
      ? await ModmailThread.findAll({
          where: {
            id: { [Op.in]: modmailThreadId },
            isActive: true,
          },
          include: includes,
        })
      : await ModmailThread.findOne({
          where: {
            id: modmailThreadId,
            isActive: true,
          },
          include: includes,
        });

    if (!modmailThread) {
      return null;
    }

    const modmailThreadData =
      Array.isArray(modmailThreadId) && modmailThreadId.length > 0
        ? modmailThread.map((item) => item.getData())
        : modmailThread.getData();
    await ModmailThread.getCqrsJoins(modmailThreadData);
    return modmailThreadData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModmailThreadAggById",
      err,
    );
  }
};

module.exports = getModmailThreadAggById;
