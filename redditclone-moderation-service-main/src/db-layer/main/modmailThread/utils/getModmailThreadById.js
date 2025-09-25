const { HttpServerError } = require("common");

let { ModmailThread } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getModmailThreadById = async (modmailThreadId) => {
  try {
    const modmailThread = Array.isArray(modmailThreadId)
      ? await ModmailThread.findAll({
          where: {
            id: { [Op.in]: modmailThreadId },
            isActive: true,
          },
        })
      : await ModmailThread.findOne({
          where: {
            id: modmailThreadId,
            isActive: true,
          },
        });

    if (!modmailThread) {
      return null;
    }
    return Array.isArray(modmailThreadId)
      ? modmailThread.map((item) => item.getData())
      : modmailThread.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModmailThreadById",
      err,
    );
  }
};

module.exports = getModmailThreadById;
