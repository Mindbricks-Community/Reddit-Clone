const { HttpServerError, BadRequestError } = require("common");

const { ModmailMessage } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getModmailMessageByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const modmailMessage = await ModmailMessage.findOne({
      where: { ...query, isActive: true },
    });

    if (!modmailMessage) return null;
    return modmailMessage.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModmailMessageByQuery",
      err,
    );
  }
};

module.exports = getModmailMessageByQuery;
