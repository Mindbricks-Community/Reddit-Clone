const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { Locale, LocalizationKey, LocalizationString } = require("models");
const { Op } = require("sequelize");

const getLocalizationKeyAggById = async (localizationKeyId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const localizationKey = Array.isArray(localizationKeyId)
      ? await LocalizationKey.findAll({
          where: {
            id: { [Op.in]: localizationKeyId },
            isActive: true,
          },
          include: includes,
        })
      : await LocalizationKey.findOne({
          where: {
            id: localizationKeyId,
            isActive: true,
          },
          include: includes,
        });

    if (!localizationKey) {
      return null;
    }

    const localizationKeyData =
      Array.isArray(localizationKeyId) && localizationKeyId.length > 0
        ? localizationKey.map((item) => item.getData())
        : localizationKey.getData();
    await LocalizationKey.getCqrsJoins(localizationKeyData);
    return localizationKeyData;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLocalizationKeyAggById",
      err,
    );
  }
};

module.exports = getLocalizationKeyAggById;
