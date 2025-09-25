const { HttpServerError, BadRequestError } = require("common");

const { Locale } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getLocaleByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const locale = await Locale.findOne({
      where: { ...query, isActive: true },
    });

    if (!locale) return null;
    return locale.getData();
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingLocaleByQuery", err);
  }
};

module.exports = getLocaleByQuery;
