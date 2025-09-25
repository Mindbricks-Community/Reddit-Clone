const { HttpServerError, BadRequestError } = require("common");

const { LocalizationString } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getLocalizationStringListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const localizationString = await LocalizationString.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!localizationString || localizationString.length === 0) return [];

    //      if (!localizationString || localizationString.length === 0) {
    //      throw new NotFoundError(
    //      `LocalizationString with the specified criteria not found`
    //  );
    //}

    return localizationString.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLocalizationStringListByQuery",
      err,
    );
  }
};

module.exports = getLocalizationStringListByQuery;
