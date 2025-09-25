const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { Locale } = require("models");
const { Op } = require("sequelize");

const getIdListOfLocaleByField = async (fieldName, fieldValue, isArray) => {
  try {
    let isValidField = false;

    const localeProperties = [
      "id",
      "localeCode",
      "displayName",
      "direction",
      "enabled",
    ];

    isValidField = localeProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof Locale[fieldName];

    if (typeof fieldValue !== expectedType) {
      throw new BadRequestError(
        `Invalid field value type for ${fieldName}. Expected ${expectedType}.`,
      );
    }

    const options = {
      where: isArray
        ? { [fieldName]: { [Op.contains]: [fieldValue] }, isActive: true }
        : { [fieldName]: fieldValue, isActive: true },
      attributes: ["id"],
    };

    let localeIdList = await Locale.findAll(options);

    if (!localeIdList || localeIdList.length === 0) {
      throw new NotFoundError(`Locale with the specified criteria not found`);
    }

    localeIdList = localeIdList.map((item) => item.id);
    return localeIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLocaleIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfLocaleByField;
