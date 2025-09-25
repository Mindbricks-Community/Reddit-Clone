const { HttpServerError, BadRequestError } = require("common");

const { LocalizationKey } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getLocalizationKeyByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const localizationKey = await LocalizationKey.findOne({
      where: { ...query, isActive: true },
    });

    if (!localizationKey) return null;
    return localizationKey.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLocalizationKeyByQuery",
      err,
    );
  }
};

module.exports = getLocalizationKeyByQuery;
