const { HttpServerError, BadRequestError } = require("common");

const { ModmailMessage } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getModmailMessageListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const modmailMessage = await ModmailMessage.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!modmailMessage || modmailMessage.length === 0) return [];

    //      if (!modmailMessage || modmailMessage.length === 0) {
    //      throw new NotFoundError(
    //      `ModmailMessage with the specified criteria not found`
    //  );
    //}

    return modmailMessage.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModmailMessageListByQuery",
      err,
    );
  }
};

module.exports = getModmailMessageListByQuery;
