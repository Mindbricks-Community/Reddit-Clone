const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { Locale, LocalizationKey, LocalizationString } = require("models");
const { Op } = require("sequelize");

const getLocalizationStringAggById = async (localizationStringId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const localizationString = Array.isArray(localizationStringId)
      ? await LocalizationString.findAll({
          where: {
            id: { [Op.in]: localizationStringId },
            isActive: true,
          },
          include: includes,
        })
      : await LocalizationString.findOne({
          where: {
            id: localizationStringId,
            isActive: true,
          },
          include: includes,
        });

    if (!localizationString) {
      return null;
    }

    const localizationStringData =
      Array.isArray(localizationStringId) && localizationStringId.length > 0
        ? localizationString.map((item) => item.getData())
        : localizationString.getData();
    await LocalizationString.getCqrsJoins(localizationStringData);
    return localizationStringData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLocalizationStringAggById",
      err,
    );
  }
};

module.exports = getLocalizationStringAggById;
