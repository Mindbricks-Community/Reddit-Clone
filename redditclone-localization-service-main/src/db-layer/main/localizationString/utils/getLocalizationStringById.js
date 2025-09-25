const { HttpServerError } = require("common");

let { LocalizationString } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getLocalizationStringById = async (localizationStringId) => {
  try {
    const localizationString = Array.isArray(localizationStringId)
      ? await LocalizationString.findAll({
          where: {
            id: { [Op.in]: localizationStringId },
            isActive: true,
          },
        })
      : await LocalizationString.findOne({
          where: {
            id: localizationStringId,
            isActive: true,
          },
        });

    if (!localizationString) {
      return null;
    }
    return Array.isArray(localizationStringId)
      ? localizationString.map((item) => item.getData())
      : localizationString.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLocalizationStringById",
      err,
    );
  }
};

module.exports = getLocalizationStringById;
