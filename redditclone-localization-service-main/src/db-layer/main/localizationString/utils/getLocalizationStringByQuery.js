const { HttpServerError, BadRequestError } = require("common");

const { LocalizationString } = require("models");
const { Op } = require("sequelize");
const { hexaLogger } = require("common");

const getLocalizationStringByQuery = async (query) => {
  try {
    if (!query || typeof query !== "object") {
      throw new BadRequestError(
        "Invalid query provided. Query must be an object.",
      );
    }

    const localizationString = await LocalizationString.findOne({
      where: { ...query, isActive: true },
    });

    if (!localizationString) return null;
    return localizationString.getData();
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLocalizationStringByQuery",
      err,
    );
  }
};

module.exports = getLocalizationStringByQuery;
