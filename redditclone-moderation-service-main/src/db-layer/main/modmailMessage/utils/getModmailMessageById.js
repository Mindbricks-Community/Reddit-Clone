const { HttpServerError } = require("common");

let { ModmailMessage } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getModmailMessageById = async (modmailMessageId) => {
  try {
    const modmailMessage = Array.isArray(modmailMessageId)
      ? await ModmailMessage.findAll({
          where: {
            id: { [Op.in]: modmailMessageId },
            isActive: true,
          },
        })
      : await ModmailMessage.findOne({
          where: {
            id: modmailMessageId,
            isActive: true,
          },
        });

    if (!modmailMessage) {
      return null;
    }
    return Array.isArray(modmailMessageId)
      ? modmailMessage.map((item) => item.getData())
      : modmailMessage.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModmailMessageById",
      err,
    );
  }
};

module.exports = getModmailMessageById;
