const { HttpServerError, BadRequestError } = require("common");

const { Locale } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getLocaleListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const locale = await Locale.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!locale || locale.length === 0) return [];

    //      if (!locale || locale.length === 0) {
    //      throw new NotFoundError(
    //      `Locale with the specified criteria not found`
    //  );
    //}

    return locale.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLocaleListByQuery",
      err,
    );
  }
};

module.exports = getLocaleListByQuery;
