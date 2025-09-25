const { HttpServerError } = require("common");

let { Locale } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getLocaleById = async (localeId) => {
  try {
    const locale = Array.isArray(localeId)
      ? await Locale.findAll({
          where: {
            id: { [Op.in]: localeId },
            isActive: true,
          },
        })
      : await Locale.findOne({
          where: {
            id: localeId,
            isActive: true,
          },
        });

    if (!locale) {
      return null;
    }
    return Array.isArray(localeId)
      ? locale.map((item) => item.getData())
      : locale.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError("errMsg_dbErrorWhenRequestingLocaleById", err);
  }
};

module.exports = getLocaleById;
