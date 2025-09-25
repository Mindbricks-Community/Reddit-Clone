const { HttpServerError, BadRequestError } = require("common");

const { LocalizationKey } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getLocalizationKeyListByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const localizationKey = await LocalizationKey.findAll({
      where: { ...query, isActive: true },
    });

    //should i add not found error or only return empty array?
    if (!localizationKey || localizationKey.length === 0) return [];

    //      if (!localizationKey || localizationKey.length === 0) {
    //      throw new NotFoundError(
    //      `LocalizationKey with the specified criteria not found`
    //  );
    //}

    return localizationKey.map((item) => item.getData());
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLocalizationKeyListByQuery",
      err,
    );
  }
};

module.exports = getLocalizationKeyListByQuery;
