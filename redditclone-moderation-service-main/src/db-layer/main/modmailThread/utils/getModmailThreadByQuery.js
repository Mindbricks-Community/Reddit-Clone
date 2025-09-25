const { HttpServerError, BadRequestError } = require("common");

const { ModmailThread } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getModmailThreadByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const modmailThread = await ModmailThread.findOne({
      where: { ...query, isActive: true },
    });

    if (!modmailThread) return null;
    return modmailThread.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModmailThreadByQuery",
      err,
    );
  }
};

module.exports = getModmailThreadByQuery;
