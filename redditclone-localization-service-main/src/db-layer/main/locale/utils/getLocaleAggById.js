const { HttpServerError, NotFoundError } = require("common");
const { hexaLogger } = require("common");

const { Locale, LocalizationKey, LocalizationString } = require("models");
const { Op } = require("sequelize");

const getLocaleAggById = async (localeId) => {
  try {
    const forWhereClause = false;
    const includes = [];

    const locale = Array.isArray(localeId)
      ? await Locale.findAll({
          where: {
            id: { [Op.in]: localeId },
            isActive: true,
          },
          include: includes,
        })
      : await Locale.findOne({
          where: {
            id: localeId,
            isActive: true,
          },
          include: includes,
        });

    if (!locale) {
      return null;
    }

    const localeData =
      Array.isArray(localeId) && localeId.length > 0
        ? locale.map((item) => item.getData())
        : locale.getData();
    await Locale.getCqrsJoins(localeData);
    return localeData;
  } catch (err) {
    throw new HttpServerError("errMsg_dbErrorWhenRequestingLocaleAggById", err);
  }
};

module.exports = getLocaleAggById;
