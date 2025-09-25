const { HttpServerError, NotFoundError, BadRequestError } = require("common");

const { LocalizationKey } = require("models");
const { Op } = require("sequelize");

const getIdListOfLocalizationKeyByField = async (
  fieldName,
  fieldValue,
  isArray,
) => {
  try {
    let isValidField = false;

    const localizationKeyProperties = [
      "id",
      "uiKey",
      "description",
      "defaultValue",
    ];

    isValidField = localizationKeyProperties.includes(fieldName);

    if (!isValidField) {
      throw new BadRequestError(`Invalid field name: ${fieldName}.`);
    }

    const expectedType = typeof LocalizationKey[fieldName];

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

    let localizationKeyIdList = await LocalizationKey.findAll(options);

    if (!localizationKeyIdList || localizationKeyIdList.length === 0) {
      throw new NotFoundError(
        `LocalizationKey with the specified criteria not found`,
      );
    }

    localizationKeyIdList = localizationKeyIdList.map((item) => item.id);
    return localizationKeyIdList;
  } catch (err) {
    throw new HttpServerError(
      "errMsg_dbErrorWhenRequestingLocalizationKeyIdListByField",
      err,
    );
  }
};

module.exports = getIdListOfLocalizationKeyByField;
