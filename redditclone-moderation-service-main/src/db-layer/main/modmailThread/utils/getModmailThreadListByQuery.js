const { HttpServerError, BadRequestError } = require("common");

const { ModmailThread } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getModmailThreadListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const modmailThread = await ModmailThread.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!modmailThread || modmailThread.length === 0) return [];

    //      if (!modmailThread || modmailThread.length === 0) {
    //      throw new NotFoundError(
    //      `ModmailThread with the specified criteria not found`
    //  );
    //}

    return modmailThread.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingModmailThreadListByQuery",
      err,
    );
  }
};

module.exports = getModmailThreadListByQuery;
