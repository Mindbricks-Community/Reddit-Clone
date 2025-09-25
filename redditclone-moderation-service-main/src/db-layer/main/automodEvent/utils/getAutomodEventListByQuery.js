const { HttpServerError, BadRequestError } = require("common");

const { AutomodEvent } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getAutomodEventListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const automodEvent = await AutomodEvent.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!automodEvent || automodEvent.length === 0) return [];

    //      if (!automodEvent || automodEvent.length === 0) {
    //      throw new NotFoundError(
    //      `AutomodEvent with the specified criteria not found`
    //  );
    //}

    return automodEvent.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingAutomodEventListByQuery",
      err,
    );
  }
};

module.exports = getAutomodEventListByQuery;
