const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { LocalizationString } = require("models");
const { Op } = require("sequelize");

const getIdListOfLocalizationStringByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const localizationStringProperties = [
      "id",
      "keyId",
      "localeId",
      "value",
      "status",
      "reviewNotes",
    ];

    isValidField = localizationStringProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof LocalizationString[fieldName];

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

    let localizationStringIdList = await LocalizationString.findAll(options);

    if (!localizationStringIdList || localizationStringIdList.length === 0) {
      throw new NotFoundError(
        `LocalizationString with the specified criteria not found`,
      );
    }

    localizationStringIdList = localizationStringIdList.map((item) => item.id);
    return localizationStringIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLocalizationStringIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfLocalizationStringByField;
