const { HttpServerError } = require("common");

let { LocalizationKey } = require("models");
const { hexaLogger } = require("common");
const { Op } = require("sequelize");

const getLocalizationKeyById = async (localizationKeyId) => {
  try {
    const localizationKey = Array.isArray(localizationKeyId)
      ? await LocalizationKey.findAll({
          where: {
            id: { [Op.in]: localizationKeyId },
            isActive: true,
          },
        })
      : await LocalizationKey.findOne({
          where: {
            id: localizationKeyId,
            isActive: true,
          },
        });

    if (!localizationKey) {
      return null;
    }
    return Array.isArray(localizationKeyId)
      ? localizationKey.map((item) => item.getData())
      : localizationKey.getData();
  } catch (err) {
    console.log(err);
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLocalizationKeyById",
      err,
    );
  }
};

module.exports = getLocalizationKeyById;
