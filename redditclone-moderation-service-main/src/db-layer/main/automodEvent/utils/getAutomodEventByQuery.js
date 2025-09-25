const { HttpServerError, BadRequestError } = require("common");

const { AutomodEvent } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAutomodEventByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const automodEvent = await AutomodEvent.findOne({
      where: { ...query, isActive: true },
    });

    if (!automodEvent) return null;
    return automodEvent.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAutomodEventByQuery",
      err,
    );
  }
};

module.exports = getAutomodEventByQuery;
